---
title: conway_rule_30
version: v192.168.1.1
author: jon@zudell.io
date: 2024-11-27T00:00:00Z
summary: >-
  **Cellular automata** are among the simplest programs. Two such automata are
  rule 30 and conway's game of life. **Conway's game of life** is a two
  dimensional cellular automata calculated on a cartesian grid. **Rule 30** is a
  one dimensional cellular automata
---

:::widget rule30 cellSize=6 width=100 height=80

**Cellular automata** are among the simplest programs. Two such automata are rule
30 and conway's game of life. **Conway's game of life** is a two dimensional
cellular automata calculated on a cartesian grid. **Rule 30** is a one
dimensional cellular automata.

## Rule 30

One dimensional cellular automata are described in depth by **Stephen Wolfram**
in his book [A new kind of science](https://www.amazon.com/New-Kind-Science-Stephen-Wolfram/dp/1579550088).
They function as such, a seed value is given. The common example is one cell
activated in the middle of a 1-D grid. Each generation the state of the grid is
used to compute the next generation.

In simple 1-D CA there are two possibilities a cell is alive or dead in each
generation. The state of the previous generation defines the state of the
following generation. The relevant state is the liveness of the previous cell and
its left and right neighbor. This yields three boolean values. 2^3 = **8**. There
are 8 distinct input states that determine the state of in the following
generation. The **Rule 30** is one of 256 possible simple 1-D CA Rules. 256 =
2^8; each rule maps the distinct input states to a boolean representing cell
liveness.

The parity between the number of input states and the number of possible rules is
no coincidence. Each number between 0 and 255 in binary is the simplest encoding
of each rule. The binary for 0 padded to 8 digits is **00000000** this means that
for all eight possible input states every output is false. Rule 255 is
**11111111** yielding true for all input states. Rule 30 is **00011110** This can
be visualized like so.

:::widget rule-visualizer ruleNumber=0

:::widget rule-visualizer ruleNumber=255

:::widget rule-visualizer ruleNumber=30

## Conway's Game of Life

Mathematician and all around genius **John Conway** devised a cellular automata
he named the **game of life**. The game of life is a two dimensional cellular
automata that has very simple rules but produces enough emergent complexity to
support structures that can run a [universal turing machine](https://conwaylife.com/wiki/Universal_Turing_machine).

Surprisingly the game of life is easier to understand than the "simple" 1-D CAs.
There is an infinite cartesian grid of cells either alive or dead. Each cell has
eight neighbors. The game of life has three rules:

- Live cells with **2 or 3** live neighbors **survive**
- Live cells with with **< 2 or > 3** neighbors will **die**
- Dead cells with exactly **3** neighbors come to **life**

## Feeding Rule 30 into Conway's game of life

If you have JavaScript enabled you have been seeing a simulation in the
background. This simulation is feeding Rule 30 into Conway's Game of Life. This
post is heavily inspired by [Cellular Automata: Rule 30 + Conway’s Game of Life](https://www.youtube.com/watch?v=IK7nBOLYzdE)
