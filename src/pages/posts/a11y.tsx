import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
}

const A11y: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='a11y'
      version='v0.2.0'
      postId='a11y'
      displaySummary={displaySummary}
      summaryContent={<p>Accessibility or a11y for short is the property of being usable by individuals with disabilities. </p>}
    >
      <h3 className='text-xl text-green-400'>
        # Overview
      </h3>
      <p>
        Accessibility or a11y for short is the property of being usable by individuals with 
        disabilities. <a className='text-blue-400 underline' href='https://dequeuniversity.com/'>https://dequeuniversity.com/</a> is 
        the defacto authority on implementing accessibility. 
      </p>
      <br/>
      <p>
        Different disabilities require different accessibility solutions. 
        A non-comprehensive list is provided below:
        <ul>
          <li>- Poor Vision</li>
          <li>- Color Blindness</li>
          <li>- Blindness</li>
          <li>- Deafness</li>
          <li>- Impaired Cognition</li>
          <li>- Technological Illiteracy</li>
        </ul>
      </p>
      <br/>
      <p>
        In the case of visual impairments there are two user cohorts that must be supported
        screen reader users and standard browser users. Accessibility concerns in are mitigated
        on multiple fronts.
      </p>
      <br/>
      <h3 className='text-xl text-green-400'>
        # JavaScript for a11y
      </h3>
      <p>
        User experiences can be greatly enhanced by leveraging JavaScript. However, it can be challenging to gracefully degrade from
        an asyncronous JavaScript driven experience to html form submission. When JavaScript is enabled the effects of dynamic content
        on screen readers must be examined. When properly implemented client side code will leverage native accessibility features to
        enhace the user experience. Consider using the <a className='text-blue-400 underline' href='https://cauldron.dequelabs.com/'>Cauldron React Library</a> it
        contains many common component patterns implemented to use ARIA features.
      </p>
      <br/>
      <h3 className='text-xl text-green-400'>
        # Keyboard First
      </h3>
      <p>
        User input should be accepted in a variety of ways such as mouse events, touch gestures, and keyboard input.
        Implementing keyboard navigation with tab selection applies to screen readers and browsers as such it is a high value item.
      </p>
      <h3 className='text-xl text-green-400'>
        # Navigation
      </h3>
      <br/>
    </Post>
  );
};

export default A11y;