import React from 'react';
import Post from '../../components/containers/Post';
import CodeBlock from '../../components/containers/CodeBlock';

interface PostProps {
  displaySummary?: boolean;
}

const Solid: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-04T00:00:00Z')}
      title="solid"
      version="v0.4.30"
      postId="solid"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          <span className="text-color-emphasis">SOLID</span> principles almost
          redeem object oriented programming. They were proposed by{' '}
          <span className="text-color-emphasis">Robert C. Martin</span> in the
          early 2000s. They are good for big thinkin&apos; and can help you
          write better code.
        </p>
      }
    >
      {' '}
      <p>
        <span className="text-color-emphasis">SOLID</span> principles almost
        redeem object oriented programming. They were proposed by{' '}
        <span className="text-color-emphasis">Robert C. Martin</span> in the
        early 2000s. They are good for big thinkin&apos; and can help you write
        better code.
      </p>
      <ul>
        <li>S - Single Responsibility Principle</li>
        <li>O - Open/Closed Principle</li>
        <li>L - Liskov Substitution Principle</li>
        <li>I - Interface Segregation Principle</li>
        <li>D - Dependency Inversion Principle</li>
      </ul>
      <br />
      <h4 className="comment-green">## Single Responsibility Principle</h4>
      <p>
        Classes of objects should do one thing 1/1 assed instead of n things 1/n
        assed. Consider the following example of several classes that work
        together to calculate the sum or difference of two spatial dimensions.
      </p>
      <CodeBlock
        code={`#!/usr/bin/python
from enum import Enum
from typing import Union

class Unit:
    '''The Single Responsibility of this class is to represent a unit of measurement.'''
    def __init__(self, name, symbol, order):
        self.name = name
        self.symbol = symbol
        self.order = order
    
    def __str__(self):
        return self.name
    

class Units(Enum):
    '''The Single Responsibility of this class is to enumerate and define the units of measurement.'''
    UM = Unit('micrometer', 'um', -3)
    MM = Unit('millimeter', 'mm', -2)
    CM = Unit('centimeter', 'cm', -1)
    M  = Unit('meter', 'm', 0)
    DM = Unit('decimeter', 'dm', 1)
    HM = Unit('hectometer', 'hm', 2)
    KM = Unit('kilometer', 'km', 3)

class Operation:
    '''The Single Responsibility of this class is to compose a function and an operator.'''
    def __init__(self, function, operator):
        self.function = function
        self.operator = operator

class Operations(Enum):
    '''The Single Responsibility of this class is to enumerate and define the operations that can take place.'''
    ADD = Operation(lambda x, y: x + y, '+')
    SUB = Operation(lambda x, y: x - y, '-')
    EQ  = Operation(lambda x, y: x == y, '==')

class Dimension:
    '''The Single Responsibility of this class is to compose a magnitude and a unit of measurement.'''
    def __init__(self, magnitude: int, unit: Unit):
        self.magnitude = magnitude
        self.unit = unit

    def __str__(self):
        return f'{self.magnitude} {self.unit.symbol}'
    
    def __eq__(self, value: "Dimension") -> bool:
        internal_value = self.magnitude * 10 ** self.unit.order
        external_value = value.magnitude * 10 ** value.unit.order
        return internal_value == external_value
    
    def __add__(self, value: "Dimension") -> "Dimension":
        if self.unit.order == value.unit.order:
            return Dimension(self.magnitude + value.magnitude, self.unit).reduce()
        else:
            internal_value = self.magnitude * 10 ** self.unit.order
            external_value = value.magnitude * 10 ** value.unit.order
            total_magnitude = internal_value + external_value
            return Dimension(total_magnitude, Units.M.value).reduce()
        
    def __sub__(self, value: "Dimension") -> "Dimension":
        if self.unit.order == value.unit.order:
            return Dimension(self.magnitude - value.magnitude, self.unit).reduce()
        else:
            internal_value = self.magnitude * 10 ** self.unit.order
            external_value = value.magnitude * 10 ** value.unit.order
            total_magnitude = internal_value - external_value
            return Dimension(total_magnitude, Units.M.value).reduce()
    

    def reduce(self) -> "Dimension":
        order = self.unit.order
        magnitude = self.magnitude
        while magnitude >= 10:
            magnitude /= 10
            order += 1

        while magnitude < 1:
            magnitude *= 10
            order -= 1
        for unit in Units:
            if unit.value.order == order:
                return Dimension(magnitude, unit.value)
            else:
                continue
        
ExpressionType = Union["Expression", Dimension]
class Expression:
    def __init__(self, left: ExpressionType, right: ExpressionType, operation: Operation):
        self.left = left
        self.right = right
        self.operation = operation

    def evaluate(self):
        return self.operation.function(self.left, self.right)`}
        title={'dimension_analysis.py'}
        language="python"
      />
      <CodeBlock
        code={`#!/usr/bin/python
import pytest

from misc.dimensional_analysis import Unit, Units, Operation, Operations, Dimension, Expression

def test_dimensional_analysis_units():
    assert Units.UM.value.name == 'micrometer'
    assert Units.UM.value.symbol == 'um'
    assert Units.UM.value.order == -3

    assert Units.MM.value.name == 'millimeter'
    assert Units.MM.value.symbol == 'mm'
    assert Units.MM.value.order == -2

    assert Units.CM.value.name == 'centimeter'
    assert Units.CM.value.symbol == 'cm'
    assert Units.CM.value.order == -1

    assert Units.M.value.name == 'meter'
    assert Units.M.value.symbol == 'm'
    assert Units.M.value.order == 0

    assert Units.DM.value.name == 'decimeter'
    assert Units.DM.value.symbol == 'dm'
    assert Units.DM.value.order == 1

    assert Units.HM.value.name == 'hectometer'
    assert Units.HM.value.symbol == 'hm'
    assert Units.HM.value.order == 2

    assert Units.KM.value.name == 'kilometer'
    assert Units.KM.value.symbol == 'km'
    assert Units.KM.value.order == 3

def test_dimensional_analysis_operations():
    assert Operations.ADD.value.function(1, 2) == 3
    assert Operations.ADD.value.operator == '+'

    assert Operations.SUB.value.function(1, 2) == -1
    assert Operations.SUB.value.operator == '-'

def test_dimensional_analysis_dimension():
    assert Dimension(1, Units.UM.value).magnitude == 1
    assert Dimension(1, Units.UM.value).unit == Units.UM.value

def test_unit_init():
    unit = Unit('meter', 'm', 0)
    assert unit.name == 'meter'
    assert unit.symbol == 'm'
    assert unit.order == 0

def test_operation_init():
    operation = Operation(lambda x, y: x + y, '+')
    assert operation.function(1, 2) == 3
    assert operation.operator == '+'

def test_dimension_init():
    dimension = Dimension(1, Units.M.value)
    assert dimension.magnitude == 1
    assert dimension.unit == Units.M.value

def test_expression_init():
    left = Dimension(1, Units.KM.value)
    right = Dimension(1000, Units.M.value)
    operation = Operations.EQ.value
    expression = Expression(left, right, operation)
    assert expression.left == left
    assert expression.right == right
    assert expression.operation == operation
    assert expression.evaluate() == True

def test_reduce():
    dimension = Dimension(1000, Units.M.value)
    reduced = dimension.reduce()
    assert reduced.magnitude == 1
    assert reduced.unit == Units.KM.value

    dimension = Dimension(1, Units.KM.value)
    reduced = dimension.reduce()
    assert reduced.magnitude == 1
    assert reduced.unit == Units.KM.value

    dimension = Dimension(100, Units.CM.value)
    reduced = dimension.reduce()
    assert reduced.magnitude == 1
    assert reduced.unit == Units.DM.value

def test_add():
    left = Dimension(1, Units.KM.value)
    right = Dimension(1000, Units.M.value)
    result = left + right
    assert result.magnitude == 2
    assert result.unit == Units.KM.value

def test_sub():
    left = Dimension(1, Units.KM.value)
    right = Dimension(1000, Units.M.value)
    result = left - right
    assert result.magnitude == 0
    assert result.unit == Units.M.value`}
        title={'test_dimension_analysis.py'}
        language="python"
      />
      <h4 className="comment-green">## Open/Closed Principle</h4>
      <p>
        Classes of objects should be open for extension but closed for
        modification. Many people think this means they should make taxonomies
        of objects and extend them. This leads them down the path of
        inheritance.
      </p>{' '}
      <br />
      <h5 className="comment-green">### Inheritance bad {'>:['}</h5>
      <p>
        <s className="text-gray-500">
          Inheritance is bad. It&apos;s like a virus that spreads and makes your
          code unreadable. It&apos;s like a bad smell that you can&apos;t get
          rid of. It&apos;s like a bad habit that you can&apos;t break.
          It&apos;s like a bad analogy that you can&apos;t stop using.
        </s>
        Consider eschewing inheritance in favor of composition. Composition is
        like inheritance but better. Composition is like a good smell that you
        can&apos;t get enough of. Composition is like a good habit that you
        can&apos;t break. Composition is like a good analogy that you can&apos;t
        stop using.
      </p>
      <br />
    </Post>
  );
};

export default Solid;
