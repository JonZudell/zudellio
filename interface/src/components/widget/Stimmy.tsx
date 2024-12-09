import React, { useEffect, useRef } from 'react';
import {
  b2World,
  b2Vec2,
  b2BodyDef,
  b2BodyType,
  b2PolygonShape,
  b2RevoluteJointDef,
  b2Body,
} from '@flyover/box2d';
interface StimmyProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  degreesOfFreedom?: number;
}
const Stimmy: React.FC<StimmyProps> = ({
  width,
  height,
  style,
  degreesOfFreedom = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createBody = (
    world: b2World,
    type: b2BodyType,
    position: b2Vec2,
    shape: b2PolygonShape,
    density: number,
  ): b2Body => {
    const bodyDef = new b2BodyDef();
    bodyDef.type = type;
    bodyDef.position.Set(position.x, position.y);
    const body = world.CreateBody(bodyDef);
    body.CreateFixture(shape, density);
    return body;
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const world = new b2World(new b2Vec2(0, 10));
      const canvasWidth = canvas.width;
      const centerX = canvasWidth / 2;
      const topY = 50;

      // Create ground
      const groundShape = new b2PolygonShape();
      groundShape.SetAsBox(0.25, 0.25);
      const groundBody = createBody(
        world,
        b2BodyType.b2_staticBody,
        new b2Vec2(centerX / 30, topY / 30),
        groundShape,
        1,
      );
      const bobs: b2Body[] = [];
      const joints: b2RevoluteJointDef[] = [];

      for (let i = 0; i < (degreesOfFreedom || 2); i++) {
        const bobShape = new b2PolygonShape();
        bobShape.SetAsBox(0.25, 0.25);
        const bobBody = createBody(
          world,
          b2BodyType.b2_dynamicBody,
          new b2Vec2(centerX / 30, (topY + (i + 1) * 100) / 30),
          bobShape,
          1,
        );
        bobs.push(bobBody);

        const jointDef = new b2RevoluteJointDef();
        if (i === 0) {
          jointDef.Initialize(
            groundBody,
            bobBody,
            new b2Vec2(centerX / 30, topY / 30),
          );
        } else {
          jointDef.Initialize(
            bobs[i - 1],
            bobBody,
            new b2Vec2(centerX / 30, (topY + i * 100) / 30),
          );
        }
        joints.push(jointDef);
        world.CreateJoint(jointDef);
      }

      // Apply random torque to all bobs
      bobs.forEach((bobBody) => {
        const randomTorque = (Math.random() - 0.5) * 20;
        bobBody.ApplyTorque(randomTorque, true);
      });

      // Apply random torque to all bobs
      bobs.forEach((bobBody) => {
        const randomTorque = (Math.random() - 0.5) * 20;
        bobBody.ApplyTorque(randomTorque, true);
        const randomImpulse = new b2Vec2(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        );
        bobBody.ApplyLinearImpulse(
          randomImpulse,
          bobBody.GetWorldCenter(),
          true,
        );
      });

      let lastTime = 0;

      const draw = (time: number) => {
        if (ctx) {
          const deltaTime = (time - lastTime) / 1000;
          lastTime = time;

          world.Step(deltaTime, 6, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw ground object as a green circle
          const groundPos = groundBody.GetPosition();
          ctx.beginPath();
          ctx.arc(
            Math.floor(groundPos.x * 30),
            Math.floor(groundPos.y * 30),
            10,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = 'green';
          ctx.fill();
          ctx.strokeStyle = 'green';
          ctx.stroke();

          // Draw lines connecting each bob
          for (let i = 0; i < bobs.length; i++) {
            const bobPos = bobs[i].GetPosition();
            if (i === 0) {
              ctx.beginPath();
              ctx.moveTo(
                Math.floor(groundPos.x * 30),
                Math.floor(groundPos.y * 30),
              );
              ctx.lineTo(Math.floor(bobPos.x * 30), Math.floor(bobPos.y * 30));
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 3;
              ctx.stroke();
            } else {
              const prevBobPos = bobs[i - 1].GetPosition();
              ctx.beginPath();
              ctx.moveTo(
                Math.floor(prevBobPos.x * 30),
                Math.floor(prevBobPos.y * 30),
              );
              ctx.lineTo(Math.floor(bobPos.x * 30), Math.floor(bobPos.y * 30));
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
          }

          // Draw all bobs on top of lines
          bobs.forEach((bobBody, index) => {
            const bobPos = bobBody.GetPosition();
            ctx.beginPath();
            ctx.arc(
              Math.floor(bobPos.x * 30),
              Math.floor(bobPos.y * 30),
              10,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle = index % 2 === 0 ? 'red' : 'blue';
            ctx.fill();
            ctx.strokeStyle = index % 2 === 0 ? 'red' : 'blue';
            ctx.stroke();
          });
          for (let i = 0; i < bobs.length; i++) {
            const bobPos = bobs[i].GetPosition();
            if (i === 0) {
              ctx.beginPath();
              ctx.moveTo(
                Math.floor(groundPos.x * 30),
                Math.floor(groundPos.y * 30),
              );
              ctx.lineTo(Math.floor(bobPos.x * 30), Math.floor(bobPos.y * 30));
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 3;
              ctx.stroke();
            } else {
              const prevBobPos = bobs[i - 1].GetPosition();
              ctx.beginPath();
              ctx.moveTo(
                Math.floor(prevBobPos.x * 30),
                Math.floor(prevBobPos.y * 30),
              );
              ctx.lineTo(Math.floor(bobPos.x * 30), Math.floor(bobPos.y * 30));
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
          }

          // Draw slopes for bobs in the middle
          for (let i = 0; i < bobs.length - 1; i++) {
            const prevBobPos =
              i === 0 ? groundBody.GetPosition() : bobs[i - 1].GetPosition();
            const bobPos = bobs[i].GetPosition();
            const nextBobPos = bobs[i + 1].GetPosition();
            const slopePrev =
              (prevBobPos.y - bobPos.y) / (prevBobPos.x - bobPos.x);
            const slopeNext =
              (bobPos.y - nextBobPos.y) / (bobPos.x - nextBobPos.x);
            ctx.fillStyle = 'black';
            ctx.fillText(
              `SlopePrev: ${slopePrev.toFixed(2)}`,
              bobPos.x * 30,
              bobPos.y * 30 - 30,
            );
            ctx.fillText(
              `SlopeNext: ${slopeNext.toFixed(2)}`,
              bobPos.x * 30,
              bobPos.y * 30 - 15,
            );
          }
        }
        requestAnimationFrame(draw);
      };

      requestAnimationFrame(draw);
    }
  }, []);

  const handleClick = () => {
    console.log('Canvas clicked');
  };

  const handleMouseUp = () => {
    console.log('Mouse up on canvas');
  };

  const handleBlur = () => {
    console.log('Canvas lost focus');
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      onBlur={handleBlur}
      width={640}
      height={480}
      style={{ width: '100%', height: '480px' }}
    ></canvas>
  );
};

export default Stimmy;
