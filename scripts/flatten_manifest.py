#!/usr/bin/env python3
import glob
import json
import os
import sys


current_file_path = os.path.abspath(__file__)
MANIFESTS_DIR = os.path.join(os.path.dirname(current_file_path), "../manifests")


def flatten_json(y):
    out = {}

    def flatten(x, name=""):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + "_")
        elif type(x) is list:
            i = 0
            for a in x:
                flatten(a, name + str(i) + "_")
                i += 1
        else:
            out[name[:-1]] = x

    flatten(y)
    return out


def split_and_group_json(data):
    grouped_data = {}

    for key, value in data.items():
        prefix, _, suffix = key.rpartition("_")
        if prefix not in grouped_data:
            grouped_data[prefix] = {}
        grouped_data[prefix][suffix] = value

    return grouped_data

def post_process(flattened_data, commit_hash):
    for key in flattened_data.keys():
        item = flattened_data[key]
        if item.get('type') == "lambda":
            item['image'] = f"{key}:{commit_hash}" 

def main(commit_hash):
    input_file = f"{MANIFESTS_DIR}/merged_manifest_{commit_hash}.json"
    output_file = f"{MANIFESTS_DIR}/{commit_hash}.json"
    
    with open(input_file, "r") as f:
        data = json.load(f)

    flattened_data = flatten_json(data)
    flattened_data = split_and_group_json(flattened_data)
    post_process(flattened_data, commit_hash)



    with open(output_file, "w") as f:
        json.dump(flattened_data, f, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: merge_manifest_rewrites.py <commit_hash>")
        sys.exit(1)

    commit_hash = sys.argv[1]
    main(commit_hash=commit_hash)
