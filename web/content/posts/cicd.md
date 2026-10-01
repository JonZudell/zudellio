---
title: cicd
version: v1.0.-10
author: jon@zudell.io
date: 2024-11-17T00:00:00Z
summary: >-
  **CI/CD** is like a big **rube goldberg machine** where the first domino to
  fall is a push to your code repo and the last domino to fall is the
  **production server**.
---

**CI/CD** is like a big **rube goldberg machine** where the first domino to fall
is a push to your code repo and the last domino to fall is the **production
server**.

## CI the brittlest process

Continuos Integration in **the process of building code and testing it on every
change set**. When changes take place in code they can have unforseen and far
reaching consequences as such it needs to be repeatedly verified at every step.
The goal is immediate knowledge of which change set broke the software. This aids
in incident response and recovery. CI processes are built to fail. It is expected
not every commit will pass. The subset that do pass should be ready to deploy to
the next environment.

## CD automated reflexive deployment

If you work on software you know that plans never survive contact with reality.
In environments that haven't embraced CI/CD deployments can happen so rarely that
the process is not well understood and prone to error. **Most production grade
software undergoes several deployments** or builds throughout its lifetime. Many
times several deployments will be required before developers understand the full
impact their changes have. In order to not push broken poorly understood, code to
production things must be tested. Part of testing is testing the deployment.

## Staged Releases

Note that not every deployment will make it to production. **The simplest way
deployments are tested without touching production** is to make staging
environments. Staging environments may perform different functions. There may be
an arbitrary number of staging environments. Most processes will use three
environments development, staging, and production. Each environment should strive
to have parity with each other.

### Development

The function of development is to function as a **sandbox with all resource
dependencies provided**, development environments may host many different change
sets at once and are hella unreliable; they tend to function as the first place
code is deployed. Development environments tend to not have perfect parity with
production. Developer permissions are the most straighforward example.

### Staging

Whereas there tend to be one development or production environments; **multiple
staging environments** are more common than multiple development environments.
When this happens it tends to be because multiple product teams are working to
get features released and the change sets are incompatible. This lets Q.A.
**examine multiple change sets** independant of eachother. Staging environments
may be **run in parallel or sequentially**.

### Production

Every bit of work done is all for naught if it doesn't make it into production.
Production should have the most stringent security configuration. All other
environments should strive to be as close to production as possible.

## Feature Flags

Another way to test the functionality of features before activating them is with
feature flags. **Feature flags are conditional statements that keep two feature
sets as part of the same deployment**. Features can be tested in the production
environment by toggling the feature for different user cohorts. In this sense
feature **flags can be used for A/B or Multi armed bandit testing**.

## Git Ops

There are many ways to enable automated deployments. A widely adopted approach is
to **use triggers in version control to manage the CI/CD process**. This is an
excellent practice because it leverages a tool developers use ubiquitously. It
also enables pinning releases to specific versions of softare as opposed to when
something was built.
