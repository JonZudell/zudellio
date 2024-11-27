import pprint
import sys

#!/usr/bin/env python3
def generate_rule(rule_number):
    # A rule is a dictionary that maps a 3-bit binary number to a 1-bit binary number
    rule = {}
    for i in range(8):
        # converts int to string with 0s prepended until three digits set
        key = bin(i)[2:].zfill(3)
        rule[key] = (rule_number >> i) & 1
    return rule

def generate_rules():
    # There are 256 unique rules
    rules = []
    for i in range(256):
        rules.append(generate_rule(i))

def generate_field(rows, columns):
    field = []
    for _ in range(rows):
        field.append([0] * columns)
    field[0][rows] = 1
    return field

def run_automaton_on_torus(rule, rows):
    columns = rows * 2 + 1
    field = generate_field(rows, columns)
    for i in range(1,rows):
        for x in range(columns):
            left_predecessor = field[i - 1][x + 1]
            center_predecessor = field[i - 1][x]
            right_predecessor = field[i -1][(x - 1) % (columns - 1)]
            computation = str(left_predecessor) + str(center_predecessor) + str(right_predecessor)
            field[i][x] = rule[computation]
    return field

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python cellular_automata_rules.py <rule_number> <rows>")
        sys.exit(1)

    rule_number = int(sys.argv[1])
    rows = int(sys.argv[2])
    rule_1 = generate_rule(rule_number=rule_number)
    field = run_automaton_on_torus(rule_1, 2 ** rows)
    for row in field:
        line = ''.join(["_" if cell == 0 else "#" for cell in row])
        print(line)

