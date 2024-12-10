#!/usr/bin/env python3
import os
import ast
import json
from datetime import datetime
import sys

# Get the absolute path of the current file
current_file_path = os.path.abspath(__file__)

# Define the lambdas and manifests directories relative to the current file
LAMBDAS_DIR = os.path.join(os.path.dirname(current_file_path), "../lambdas")
CONTAINERS_DIR = os.path.join(os.path.dirname(current_file_path), "../containers")
PERSISTENCE_DIR = os.path.join(os.path.dirname(current_file_path), "../persistence")
MANIFESTS_DIR = os.path.join(os.path.dirname(current_file_path), "../manifests")


def read_python_files_to_ast(directory):
    """
    Reads all Python files under the specified directory into an AST.

    Args:
        directory (str): The directory to search for Python files.

    Returns:
        dict: A dictionary where keys are file paths and values are AST nodes.
    """
    ast_trees = {}
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    file_content = f.read()
                    ast_tree = ast.parse(file_content, filename=file_path)
                    ast_trees[file_path] = ast_tree
    return ast_trees


def select_models_from_ast(ast_trees):
    """
    Selects all ClassDefs that have a base of id 'Model' from the given AST trees.

    Args:
        ast_trees (dict): A dictionary where keys are file paths and values are AST nodes.

    Returns:
        dict: A dictionary where keys are file paths and values are lists of ClassDef nodes.
    """
    models = {}
    for file_path, ast_tree in ast_trees.items():
        class_defs = [
            node
            for node in ast.walk(ast_tree)
            if isinstance(node, ast.ClassDef)
            and any(
                base.id == "Model" for base in node.bases if isinstance(base, ast.Name)
            )
        ]
        if class_defs:
            models[file_path] = class_defs
    return models


def extract_class_attributes(models):
    """
    Extracts attributes from ClassDef nodes.

    Args:
        models (dict): A dictionary where keys are file paths and values are lists of ClassDef nodes.

    Returns:
        dict: A dictionary where keys are class names and values are dictionaries of attribute names and their function IDs.
    """
    class_attributes = {}
    for file_path, class_defs in models.items():
        for class_def in class_defs:
            attributes = {}
            for node in class_def.body:
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name):
                            if isinstance(node.value, ast.Call) and isinstance(
                                node.value.func, ast.Name
                            ):
                                attributes[target.id] = node.value.func.id
            class_attributes[class_def.name] = attributes
    return class_attributes

def get_lambdas(lambdas_dir):
    result = {}
    for item in os.listdir(lambdas_dir):
        item_path = os.path.join(lambdas_dir, item)
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
                image = "_".join(full_path.split("/")[:-1]) + f"_{method}"
                result[item] = {
                    "type": "lambda",
                    "method": method,
                    "tag": tag,
                    "Dockerfile": os.path.join(item_path, "Dockerfile"),
                    "path": path,
                    "image": f"{image}:{tag}"
                }
            else:
                result[item] = get_lambdas(item_path)
    return result


def get_containers(containers_dir):
    result = {}
    for item in os.listdir(containers_dir):
        item_path = os.path.join(containers_dir, item)
        if item == "__pycache__":
            continue
        if os.path.isdir(item_path):
            children = os.listdir(item_path)
            if "Dockerfile" in children:
                full_path = os.path.relpath(item_path, start=LAMBDAS_DIR)
                name = full_path.split("/")[-1]
                path = "/".join(full_path.split("/"))
                result[item] = {
                    "type": "container",
                    "name": name,
                    "tag": tag,
                    "Dockerfile": os.path.join(item_path, "Dockerfile"),
                    "path": path,
                }
            else:
                result[item] = get_lambdas(item_path)
    return result

def flatten_lambdas(lambdas):
    flat_lambdas = {}
    for key, value in lambdas.items():
        if "post" in value.keys():
            if value['post']["type"] == "lambda":
                flat_lambdas[f"{key}_post"] = value['post']
        if "get" in value.keys():
            if value['get']["type"] == "lambda":
                flat_lambdas[f"{key}_get"] = value['get']
            
    return flat_lambdas

def generate_dynamodb():
    ast_trees = read_python_files_to_ast(PERSISTENCE_DIR)
    models = select_models_from_ast(ast_trees)
    class_attributes = extract_class_attributes(models)
    return class_attributes
def write_manifest(output, manifest_dir, tag, type):
    """
    Writes class attributes to a manifest file.

    Args:
        class_attributes (dict): A dictionary where keys are class names and values are dictionaries of attribute names and their function IDs.
        manifest_dir (str): The directory to write the manifest file to.
        image_tag (str): The tag to use for naming the manifest file.

    Returns:
        None
    """
    manifest_path = os.path.join(manifest_dir, f"{tag}_{type}.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: merge_manifest_rewrites.py <tag>")
        sys.exit(1)

    tag = sys.argv[1]
    lambdas = flatten_lambdas(get_lambdas(LAMBDAS_DIR))
    containers = get_containers(CONTAINERS_DIR)
    dynamodb = generate_dynamodb()
    write_manifest(lambdas, MANIFESTS_DIR, tag, "lambdas")
    write_manifest(containers, MANIFESTS_DIR, tag, "containers")
    write_manifest(dynamodb, MANIFESTS_DIR, tag, "dynamodb")