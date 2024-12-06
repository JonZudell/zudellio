#!/usr/bin/env python3
import os
import json
from datetime import datetime
import sys

# Get the absolute path of the current file
current_file_path = os.path.abspath(__file__)

# Define the lambdas and manifests directories relative to the current file
LAMBDAS_DIR = os.path.join(os.path.dirname(current_file_path), "../lambdas")
MANIFESTS_DIR = os.path.join(os.path.dirname(current_file_path), "../manifests")


def generate_json(dir_path, commit_hash, indent=2):
    result = {}
    for item in os.listdir(dir_path):
        item_path = os.path.join(dir_path, item)
        if item == "__pycache__":
            continue
        if os.path.isdir(item_path):
            children = os.listdir(item_path)
            if (
                any(child.endswith("handler.py") for child in children)
                and "Dockerfile" in children
            ):
                full_path = os.path.relpath(item_path, start=LAMBDAS_DIR)
                method = full_path.split("/")[1]
                path = "/".join(full_path.split("/")[:-1])
                result[item] = {
                    "type": "lambda",
                    "method" : method,
                    "Dockerfile": os.path.join(item_path, "Dockerfile"),
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
    manifest = generate_json(LAMBDAS_DIR, commit_hash)
    manifest_path = os.path.join(MANIFESTS_DIR, f"manifest_{commit_hash}.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
