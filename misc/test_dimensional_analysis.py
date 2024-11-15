#!/usr/bin/python
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
    assert result.unit == Units.M.value