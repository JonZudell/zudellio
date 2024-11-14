import React from 'react';
import Post from '../../components/containers/Post';
import CodeBlock from '../../components/containers/CodeBlock';

interface PostProps {
  displaySummary?: boolean;
}

const ObjectOriented: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="oop"
      version="v0.1.0"
      postId="oop"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          In the beginning, 1 January 1970, there were no paradigms only math
          and it was good. Before object oriented programming was invented there
          were no objects. It wasn&apos;t until 1967 that Alan Kay invented
          objects. This was when things started to go downhill. Before objects
          associations couldn&apos;t be made. What is the relationship between a
          person and a name? Who knows those are objects.
        </p>
      }
    >
      <p>
        In the beginning, 1 January 1970, there were no paradigms only math and
        it was good. Before object oriented programming was invented there were
        no objects. It wasn&apos;t until 1967 that Alan Kay invented objects.
        This was when things started to go downhill. Before objects associations
        couldn&apos;t be made. What is the relationship between a person and a
        name? Who knows, that would be an object.
      </p>
      <br />
      <h3 className="comment-green"># What are objects?</h3>
      <p>
        Objects consist of functions and data. That&apos;s it. Which is a neat
        idea when the alternative is reading assembly instructions and register
        values. Some people refer to functions as methods; they are wrong.
      </p>
      <br />
      <h3 className="comment-green"># Gooder ideas for big thinkin&apos;</h3>
      <p>Some good ideas for big thinkin&apos; are SOLID principles.</p>
      <ul>
        <li>S - Single Responsibility Principle</li>
        <li>O - Open/Closed Principle</li>
        <li>L - Liskov Substitution Principle</li>
        <li>I - Interface Segregation Principle</li>
        <li>D - Dependency Inversion Principle</li>
      </ul>
      <p>
        These principles are good for big thinkin&apos; and can help you write
        better code. So let us unpack what they mean.
      </p>
      <br />
      <h4 className="comment-green">## Single Responsibility Principle</h4>
      <p>
        Classes of objects should do one thing 1/1 assed instead of n things 1/n
        assed.
      </p>
      <CodeBlock
        className=""
        code={`#!/usr/bin/python
from enum import Enum

class Unit:
    def __init__(self, name, symbol, order):
        self.name = name
        self.symbol = symbol
        self.order = order

class Units(Enum):
    UM = Unit('micrometer', 'um', -3)
    MM = Unit('millimeter', 'mm', -2)
    CM = Unit('centimeter', 'cm', -1)
    M  = Unit('meter', 'm', 0)
    DM = Unit('decimeter', 'dm', 1)
    HM = Unit('hectometer', 'hm', 2)
    KM = Unit('kilometer', 'km', 3)

class Operation:
    def __init__(self, left, right, operator):
        self.left = left
        self.right = right
        self.operator = operator

class Operations(Enum):
    
  
class Dimension:
    def __init__(self, magnitude, unit):
        self.magnitude = magnitude
        self.unit = unit

class Expression:
    def __init__(self, left, right):
        self.left = left
        self.right = right

    def evaluate(self):
        return self.left.magnitude * 10 ** (self.right.order - self.left.unit.order)
`}
        title={''}
        language="python"
      />
      <br />
      <h4 className="comment-green">## Open/Closed Principle</h4>
      <p>
        Classes of objects should be open for extension but closed for
        modification. Many people achieve think this means they should make
        taxonomies of objects and extend them. This leads them down the path of
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

export default ObjectOriented;
