#!/usr/bin/env python3
import os
import json
from datetime import datetime
import sys

# Get the absolute path of the current file
current_file_path = os.path.abspath(__file__)

# Define the lambdas and manifests directories relative to the current file
CONTAINERS_DIR = os.path.join(os.path.dirname(current_file_path), "../containers")
MANIFESTS_DIR = os.path.join(os.path.dirname(current_file_path), "../manifests")


def generate_json(dir_path, commit_hash, indent=2):
    result = {}
    for item in os.listdir(dir_path):
        item_path = os.path.join(dir_path, item)
        if item == "__pycache__":
            continue
        if os.path.isdir(item_path):
            children = os.listdir(item_path)
            if "Dockerfile" in children:
                full_path = os.path.relpath(item_path, start=CONTAINERS_DIR)
                name = full_path.split("/")[-1]
                path = "/".join(full_path.split("/")[:-1])
                result[item] = {
                    "type": "container",
                    "Dockerfile": os.path.join(item_path, "Dockerfile"),
                    "name": name,
                    "path": path,
                }
            else:
                result[item] = generate_json(item_path, indent + 2)
    return result


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: merge_manifest_rewrites.py <commit_hash>")
        sys.exit(1)

    commit_hash = sys.argv[1]

    # Generate the JSON and save to manifest with timestamp
    manifest = generate_json(CONTAINERS_DIR, commit_hash)
    manifest_path = os.path.join(MANIFESTS_DIR, f"{commit_hash}_containers.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
