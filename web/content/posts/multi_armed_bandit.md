---
title: multi_armed_bandit
version: v0.0.0
author: jon@zudell.io
date: 2024-12-07T00:00:00Z
summary: >-
  The multi armed bandit is a problem in machine learning that is analagous to
  the question "When running multiple A/B tests in parallel parallel how do you
  distribute users across experiences based on outcomes?" This is the
  explore/exploit dilemma.
---

The multi armed bandit is a problem in machine learning that is analagous to the
question "When running multiple A/B tests in parallel how do you distribute users
across experiences based on outcomes?" This is the explore/exploit dilemma.

## Explore/Exploit Dilemma

The purpose of A/B testing is to differentiate experiences based on outcome. For
every user that visits the site the question "In order to maximize an outcome;
which experience should I assign the user." must be asked. If you always take the
safe bet how can you cannot be sure that other options do not have higher yields.
One solution is to select the option with the best option so far but give more
weight to less thoroughly tested options. This is the Upper Confidence Bound
algorithm.

### Upper Confidence Bound (UCB) Algorithm

The Upper Confidence Bound (UCB) algorithm is used to balance exploration and
exploitation. The formula for UCB is:

```
UCB = x + sqrt((2 * ln(n)) / ni)
```

Where:

- `x` is the average reward of the option
- `n` is the total number of trials
- `ni` is the number of times the option has been selected
