---
title: solid
version: v0.4.30
author: jon@zudell.io
date: 2024-11-04T00:00:00Z
summary: >-
  **SOLID** principles almost redeem object oriented programming. They were
  compiled and proposed by **Robert C. Martin** in the early 2000s. They are good
  for big thinkin' and can help you write better code.
---

**SOLID** principles almost redeem object oriented programming. They were
compiled and proposed by **Robert C. Martin** in the early 2000s. They are good
for big thinkin' and can help you write better code.

- S - Single Responsibility Principle
- O - Open/Closed Principle
- L - Liskov Substitution Principle
- I - Interface Segregation Principle
- D - Dependency Inversion Principle

## Single Responsibility Principle

Classes of objects should do one thing **1/1** assed instead of **n** things
**1/n** assed. When objects start to handle address too many concerns it causes
an exponential growth in complexity. The point of Object Oriented Programming is
to encapsulate data and functionality. When done appropriately this minimizes
coupling. When features can not be isolated to specific classes they are
described as cross-cutting concerns.

## Open/Closed Principle

Classes of objects should be open for extension but closed for modification. Many
people think this means they should make taxonomies of objects and extend them.
This leads them down the path of inheritance.

### Inheritance bad >:[

~~Inheritance is bad. It's like a virus that spreads and makes your code unreadable. It's like a bad smell that you can't get rid of. It's like a bad habit that you can't break. It's like a bad analogy that you can't stop using.~~
Consider eschewing inheritance in favor of composition. Composition is like
inheritance but better. Composition is like a good smell that you can't get
enough of. Composition is like a good habit that you can't break. Composition is
like a good analogy that you can't stop using.

## Liskov Substitution Principle

The liskov substition principle was first described by **Barbara Liskov** It
states that a class of object must be replaceable by its subclass. In the context
of Object Oriented languages this is typically handled with inheritence or
interfaces. Interfaces are the prefered option because it is interfaces are not
inheritance.

### LSP for Free with Dynamic Types

In languages like Python, Ruby, and JavaScript types exist but these languages
use dynamic type systems vs static type systems like Java where types do not
change during the life of an object. This ends up meaning that you can write
higher order functions which are a staple of
[Functional Programming](/posts/functional)

## Interface Segregation

Coupling is necessary in programming but it should be minimized. One way to
achieve this is to break apart interfaces or objects into composable elements.
This way when an interface is used the baggage associated with it is minimized.

## Dependancy Inversion

This principle is equally as applicable to
[Functional Programming](/posts/functional) as it is to
[Object Oriented Programming](/posts/oop). Dependancy inversion is the practice
of providing all configuration, parameters, or data up front. Instead of
collecting this information later during runtime. The reason this is applicable
to Functional Programming is this minimizes side effects. This makes code less
repetitive if multiple parts of your program need to query the same data it can
be queried up front and then provided where needed.
