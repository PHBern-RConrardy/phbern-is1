#!/usr/bin/env python3

import subprocess
import sys


DEFAULT_MESSAGE = "Update project"


def run(command):
    print(f"> {' '.join(command)}")
    result = subprocess.run(command)

    if result.returncode != 0:
        print(f"\nError: command failed: {' '.join(command)}")
        sys.exit(result.returncode)

    return result


def has_staged_changes():
    result = subprocess.run(
        ["git", "diff", "--cached", "--quiet"]
    )
    return result.returncode != 0


def main():
    message = " ".join(sys.argv[1:]).strip() or DEFAULT_MESSAGE

    print("Adding files...")
    run(["git", "add", "."])

    if not has_staged_changes():
        print("No changes to commit.")
        return

    print(f"Committing with message: {message}")
    run(["git", "commit", "-m", message])

    print("Pushing to GitHub...")
    run(["git", "push"])

    print("Done.")


if __name__ == "__main__":
    main()