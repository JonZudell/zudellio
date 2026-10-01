---
title: functional
version: v0.1.0
author: jon@zudell.io
date: 2024-09-20T00:00:00Z
summary: >-
  **Functional Programming** is simple you have functions. Functions take inputs
  and return outputs. ~~Everything else is a lie. The end. I am a functional
  programmer. I am a functional programmer. I am a functional programmer. I am a
  functional programmer. I am a functional programmer.~~ Functions can also have
  side effects. If a function has no side effects it is a pure function. Pure
  functions are the best functions. This is nearly self-evident. If you have a
  side effecting function you have few guarantees.
---

## Functional Programming

**Functional Programming** is simple you have functions. Functions take inputs
and return outputs. ~~Everything else is a lie. The end. I am a functional
programmer. I am a functional programmer. I am a functional programmer. I am a
functional programmer. I am a functional programmer.~~ Functions can also have
side effects. If a function has no side effects it is a pure function. Pure
functions are the best functions. This is nearly self-evident. If you have a side
effecting function you have few guarantees.

![It's all data](/posts/functional/itsalldata.png)

## Side Effects

As a matter of practicality, side effects are unavoidable. Side effects inclue
input output, user interface updates, acquiring locks, querying any data source,
the list goes on... The downsides of side effects can be compartmentalized and
mitigated. I prefer to take an [Object Oriented](/posts/oop) approach to side
effects. I like to encapsulate side effects in objects to compartmentalize and
mitigate the downsides.

## Functions as Data

Good programming languages recognize the truth: Functions are Data. This leads to
**higher order functions** if a language doesn't have higher order functions I
don't want none hun. Higher Order Functions are simply functions that take
functions as arguments. Python decorators are an example of a higher order
function. In practice higher order functions tend wrap to wrap or call the
functions passed to them but it is possible for a higher order function to
**modify the function** passed to it in some way. In the world of purely
functional programming higher order functions may exist as combinators. One such
combinator is the **fixed point combinator otherwise known as the Y-combinator**
it performs the function of enabling pure anonymous functions to call themselves.
