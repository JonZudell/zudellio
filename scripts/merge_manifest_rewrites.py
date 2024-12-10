#!/usr/bin/env python3
import json
import os
import glob
import sys


def recursive_update(d, u):
    for k, v in u.items():
        if isinstance(v, dict) and k in d:
            d[k] = recursive_update(d.get(k, {}), v)
        else:
            d[k] = v
    return d


def get_most_recent_manifest():
    # get the list of manifest files in the ../manifests directory
    manifest_dir = os.path.join(os.path.dirname(__file__), "../manifests")
    manifest_files = glob.glob(os.path.join(manifest_dir, "*.json"))

    # Find the most recent manifest file
    most_recent_manifest = max(manifest_files, key=os.path.getctime)

    # Load the most recent manifest file
    return load_json(most_recent_manifest)


def load_json(filepath):
    with open(filepath, "r") as f:
        return json.load(f)


def parse_rewrites(rewrites, most_recent_manifest):
    new_manifest = most_recent_manifest.copy()
    # Update the manifest with the rewrites
    for rewrite in rewrites:
        split_path = rewrite["source"].split("/")
        split_path = list(filter(None, split_path))
        reference = new_manifest
        while len(split_path):
            path = split_path.pop(0)
            if path not in reference:
                reference[path] = {}
            if not len(split_path):
                if "get" not in reference[path]:
                    reference[path]["get"] = {}
                reference[path]["get"]["type"] = "static"
                reference[path]["get"]["destination"] = rewrite["destination"]
            reference = reference[path]
    return new_manifest


def merge_manifest_rewrites(date_str):
    # get the most recent manifest
    most_recent_manifest = get_most_recent_manifest()

    # Load the manifest rewrites
    rewrites = load_json(
        os.path.join(os.path.dirname(__file__), "../interface/dist/rewrites.json")
    )["rewrites"]
    new_rewrites = parse_rewrites(rewrites, most_recent_manifest)
    # Update the manifest with the rewrites
    updated_manifest = recursive_update(most_recent_manifest, new_rewrites)

    # Save the updated manifest
    with open(
        os.path.join(os.path.dirname(__file__), f"../manifests/merged_manifest_{date_str}.json"),
        "w",
    ) as f:
        json.dump(updated_manifest, f, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: merge_manifest_rewrites.py <date_str>")
        sys.exit(1)

    date_str = sys.argv[1]
    merge_manifest_rewrites(date_str=date_str)
