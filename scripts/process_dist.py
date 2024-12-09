#!/usr/bin/env python3
import json
import os
import glob
import sys

# Get the absolute path of the current file
current_file_path = os.path.abspath(__file__)

# Define the lambdas and manifests directories relative to the current file
DIST_DIR = os.path.join(os.path.dirname(current_file_path), "../dist")
INTERFACE_DIST_DIR = os.path.join(os.path.dirname(current_file_path), "../interface/dist")


def walk(path):
    """Yields a list of tuples containing source path and target path"""
    for root, dirs, files in os.walk(path):
        for file in files:
            source_path = os.path.join(root, file)
            target_path = os.path.relpath(source_path, path)
            yield source_path, target_path
    
def clear_dist(target_dir):
    if os.path.exists(target_dir):
        for root, dirs, files in os.walk(target_dir, topdown=False):
            for file in files:
                os.remove(os.path.join(root, file))
            for dir in dirs:
                os.rmdir(os.path.join(root, dir))
        os.rmdir(target_dir)


def process_dist(commit_hash):
    target_dir = os.path.join(DIST_DIR, commit_hash)
    clear_dist(target_dir)
    for source_path, target_path in walk(INTERFACE_DIST_DIR):
        target_file_path = os.path.join(target_dir, target_path)
        #print(source_path, target_path)
        if target_file_path.endswith("index.html") and target_path != "index.html":
            target_file_path = os.path.dirname(target_file_path)

        os.makedirs(os.path.dirname(target_file_path), exist_ok=True)
        with open(source_path, 'rb') as src_file:
            with open(target_file_path, 'wb') as tgt_file:
                tgt_file.write(src_file.read())


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: process_dist.py <commit_hash>")
        sys.exit(1)

    commit_hash = sys.argv[1]
    process_dist(commit_hash)