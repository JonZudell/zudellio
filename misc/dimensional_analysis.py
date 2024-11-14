#!/usr/bin/python
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
        return self.operation.function(self.left, self.right)