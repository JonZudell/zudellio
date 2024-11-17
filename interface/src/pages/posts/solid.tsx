import React from 'react';
import Post from '../../components/containers/Post';
import CodeBlock from '../../components/containers/CodeBlock';
import AccessibleLink from '../../components/input/AccessibleLink';

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
          redeem object oriented programming. They were compiled and proposed by{' '}
          <span className="text-color-emphasis">Robert C. Martin</span> in the
          early 2000s. They are good for big thinkin&apos; and can help you
          write better code.{' '}
        </p>
      }
    >
      {' '}
      <p>
        <span className="text-color-emphasis">SOLID</span> principles almost
        redeem object oriented programming. They were proposed compiled and
        proposed by{' '}
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
      <h3 className="comment-green">## Single Responsibility Principle</h3>
      <p>
        Classes of objects should do one thing 1/1 assed instead of n things 1/n
        assed. When objects start to handle address too many concerns it causes
        an exponential growth in complexity. The point of Object Oriented
        Programming is to encapsulate data and functionality. When done
        appropriately this minimizes coupling.
      </p>
      <br />
      <h3 className="comment-green">## Open/Closed Principle</h3>
      <p>
        Classes of objects should be open for extension but closed for
        modification. Many people think this means they should make taxonomies
        of objects and extend them. This leads them down the path of
        inheritance.
      </p>{' '}
      <br />
      <h4 className="comment-green">### Inheritance bad {'>:['}</h4>
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
      <h3 className="comment-green">## Liskov Substitution Principle</h3>
      <p>
        The liskov substition principle was first described by{' '}
        <span className="text-color-emphasis">Barbara Liskov</span> It states
        that a class of object must be replaceable by its subclass. In the
        context of Object Oriented languages this is typically handled with
        inheritence or interfaces. Interfaces are the prefered option because it
        is interfaces are not inheritance.
      </p>
      <br />
      <h4 className="comment-green">### LSP for Free with Dynamic Types</h4>
      <p>
        In languages like Python, Ruby, and JavaScript types exist but these
        languages use dynamic type systems vs static type systems like Java
        where types do not change during the life of an object. This ends up
        meaning that you can write higher order functions which are a staple of{' '}
        <AccessibleLink
          text={'Functional Programming'}
          href={'/posts/functional'}
          ariaLabel={'/posts/functional'}
          decorationLeft="["
          decorationRight="]"
        ></AccessibleLink>
      </p>
      <br />
      <h3 className="comment-green">## Interface Segregation</h3>
      <p>
        Coupling is necessary in programming but it should be minimized. One way
        to achieve this is to break apart interfaces or objects into composable
        elements. This way when an interface is used the baggage associated with
        it is minimized.
      </p>
      <br />
      <h3 className="comment-green">## Dependancy Inversion</h3>
      <p>
        This principle is equally as applicable to{' '}
        <AccessibleLink
          text={'Functional Programming'}
          href={'/posts/functional'}
          ariaLabel={'/posts/functional'}
          decorationLeft="["
          decorationRight="]"
        />
        as it is to{' '}
        <AccessibleLink
          text={'Object Oriented Programming'}
          href={'/posts/oop'}
          ariaLabel={'/posts/oop'}
          decorationLeft="["
          decorationRight="]"
        />
        . Dependancy inversion is the practice of providing all configuration,
        parameters, or data up front. Instead of collecting this information
        later during runtime. The reason this is applicable to Functional
        Programming is this minimizes side effects. This makes code less
        repetitive if multiple parts of your program need to query the same data
        it can be queried up front and then provided where needed.
      </p>
    </Post>
  );
};

export default Solid;
