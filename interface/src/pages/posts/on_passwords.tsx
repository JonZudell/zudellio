import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';
interface PostProps {
  displaySummary: boolean;
}

const OnPasswords: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="on_passwords"
      version="v1.33.7"
      postId="on_passwords"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          Passwords are a ubiquitous mechanism for authentication. Before the
          advent of Single Sign On via OAUTH or SAML we had dozens of passwords
          with different constraints for systems on the same network. Things are
          better now but passwords are still the most prolific form of
          authentication.
        </p>
      }
    >
      <p>
        Passwords are a ubiquitous mechanism for authentication. Before the
        advent of Single Sign On via OAUTH or SAML we had dozens of passwords
        with different constraints for systems on the same network. Things are
        better now but passwords are still the most prolific form of
        authentication.
      </p>
      <br />
      <h3 className="comment-green"># The problem(s) with Password</h3>
      <p>
        Passwords when implemented correctly are great. The problem is they are
        often implemented incorrectly, sometimes egregiously so. A
        non-exhaustive list of{' '}
        <span className="color-text-emphasis">password fuck-ups</span>:
      </p>
      <ul>
        <li>Maximum Password Lengths</li>
        <li>Improper Password Hashing or Not Hashing at all</li>
        <li>Not Salting your hashes</li>
        <li>Complexity Requirements</li>
        <li>Max Password Ages</li>
        <li>Improper Mitigation for Improper Password Hashing</li>
      </ul>
      <br />
      <h4 className="comment-green">## What is a password fuck-up?</h4>
      <p>
        A password fuck-up is an error in handling passwords that has negative
        implications for the privacy and security of your end users.
      </p>
      <br />
      <h4 className="comment-green">## Maximum Password Lengths</h4>
      <p>
        In practice passwords need to have some max length constraint but it can
        easily be in the hundreds or thousands of characters. 99.9% of users
        will never have a password any where near that length. But perhaps
        you&apos;ve created an account on a banking website that had a maximum
        password length of something like 12 characters. This is absurdly low
        and an indication that passwords are not being hashed and stored in
        plain text. I assume any service like this has been compromised by third
        parties.The site operators apparently do not know the first thing about
        user account security; that being you hash user passwords.
      </p>
      <br />
      <h4 className="comment-green">
        ## Improper Password Hashing or Not Hashing at all
      </h4>
      <p>
        Hash functions take input of indefinite length and return an output that
        corelates with the input of definite length. Take the python lambda{' '}
        <span className="inline-code">lambda x: x % 3 == 0</span> for a given
        input value in binary there will be one corresponding output. This is a
        hashing function. However, this hashing function is not suitable for
        password hashing for several reasons. This is the job of
        cryptographically secure hashing functions. A cryptographically secure
        hashing function is a hashing function that has the following property:
        Determining the value of the hashing function input based purely on the
        output is more costly than performing an exhaustive search over all
        possible inputs. For a secure hash function with an `n`-bit output, this
        complexity is on the order of `2^n` operations, making it
        computationally infeasible to reverse the hash function. This means that
        even if your database is compromised hackers won&apos;t know your users
        passwords. This is not sufficient alone because attackers pre compute
        the input space for common passwords or previously compromised
        passwords. Pre computed hash tables are called{' '}
        <span className="color-text-emphasis">Rainbow Tables</span> and in order
        to protect against them you need to{' '}
        <span className="color-text-emphasis">salt your passwords</span>.
      </p>
      <br />
      <h4 className="comment-green">## Not Salting your hashes</h4>
      <p>
        <span className="color-text-emphasis">Rainbow Tables</span> essentially
        memoize the password hash cracking process. To defend against rainbow
        tables password hashes need to be salted. A salt is a random value that
        is appended to the users password before hashing. The salt is stored
        alongside the password hash. Using a salt makes generating rainbow
        tables impractical because the password + the hash is generally far too
        long to have been generated by brute force. Each salt is unique per
        password and site login. This means if you use the same password on two
        sites it won&apos;t be apparent that the passwords are the same purely
        without testing password validation.
      </p>
      <br />
      <h4 className="comment-green">## Complexity Requirements</h4>
      <p>
        Enforcing complexity requirements can seem sensible but{' '}
        <a
          className="href-blue underline"
          href="https://cybersecuritynews.com/nist-rules-password-security/"
        >
          NIST
        </a>{' '}
        guidance says otherwise. Users will frequently do the minimum to achieve
        password complexity requirements and the complexity requirements may be
        incompatible with pre generated password manager passwords. This leads
        to a situation where because passwords are of minimum length 8 and
        require one number and one special character password entropy is
        effectively lowered because of human behaviour a 10 letter word is
        harder to guess than a 6 letter word with a number and special
        character.
      </p>
      <br />
      <h4 className="comment-green">## Max Password Ages</h4>
      <p>
        Maximum password age is implemented with good intentions but it
        encourages users to reuse passwords accross service or come up with
        insecure passwords. Let users chose their own security posture when it
        comes to password rotation. Unless you know passwords have become
        compromised.
      </p>
      <br />
      <h4 className="comment-green">
        ## Improper Mitigation for Improper Password Hashing
      </h4>
      <p>
        Let&apos;s consider a scenario where a database of users has been hashed
        with a an unfit hashing algorithm like md5. The original passwords
        can&apos;t be known because only password hashes are stored. So in an
        effort to mitigate the issues passwords are rehashed. This leaves the
        database open to password shucking. Password shucking is possible when
        the input space to a hash function is known. Since hash functions
        produce recognizeable output you effectively only get the security of
        the original hash function. To mitigate this you can salt your password
        hashes for every layer of hashing.
      </p>
      <br />
      <h3 className="comment-green"># Password Insights</h3>
      <p>
        <a
          href="https://www.amazon.com/Hash-Crack-Password-Cracking-Manual/dp/1793458618"
          className="href-blue underline"
        >
          Hash Crack: Password Cracking Manual
        </a>{' '}
        Contains useful insights on user password behaviour to consider. When
        hackers crack hashes they are not assaulting the whole hash algorithm
        input space; they are attacking the weak link the human element. Here
        are some examples of human behaviour in the book:
      </p>
      <ul>
        <li>The average password ranges from 7-9 characters in length</li>
        <li>The average Engliush word is 5 characters long</li>
        <li>The average person knows 50,000 to 150,000 words</li>
        <li>
          50% chance a user&apos;s password will contain one or more vowels
        </li>
        <li>
          Women prefer personal names in their passwords, and men prefer hobbies
        </li>
        <li>Most likely to be used symbols ~, !, @, #, $, %, &, *, ?</li>
        <li>
          If a number, it&apos;s usually a 1 or 2, sequential, and will likely
          be at the end
        </li>
        <li>
          If more than one number, it will usually be sequential or personally
          relevant
        </li>
        <li>
          If a capital letter, it&apos;s usually the beginning, followed by a
          vowel
        </li>
        <li>66% of people only use 1 - 3 passwords for all online accounts</li>
        <li>One in nine people have a password based on the Top 500 list</li>
        <li>
          Western countries use lowercase passwords and Eastern countries prefer
          digits
        </li>
      </ul>
    </Post>
  );
};

export default OnPasswords;
