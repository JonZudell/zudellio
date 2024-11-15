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


def main(date_str):
    input_file = f"{MANIFESTS_DIR}/merged_manifest{date_str}.json"
    output_file = f"{MANIFESTS_DIR}/flattened_manifest{date_str}.json"
    
    with open(input_file, "r") as f:
        data = json.load(f)

    flattened_data = flatten_json(data)
    flattened_data = split_and_group_json(flattened_data)

    with open(output_file, "w") as f:
        json.dump(flattened_data, f, indent=4)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: merge_manifest_rewrites.py <date_str>")
        sys.exit(1)

    date_str = sys.argv[1]
    main(date_str=date_str)
