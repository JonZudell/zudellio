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

const Stimmy: React.FC = () => {
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

      // Create first pendulum bob
      const bobShape1 = new b2PolygonShape();
      bobShape1.SetAsBox(0.25, 0.25);
      const bobBody1 = createBody(
        world,
        b2BodyType.b2_dynamicBody,
        new b2Vec2(centerX / 30, (topY + 100) / 30),
        bobShape1,
        1,
      );

      // Create second pendulum bob
      const bobShape2 = new b2PolygonShape();
      bobShape2.SetAsBox(0.25, 0.25);
      const bobBody2 = createBody(
        world,
        b2BodyType.b2_dynamicBody,
        new b2Vec2(centerX / 30, (topY + 200) / 30),
        bobShape2,
        2,
      );

      // Create revolute joint between ground and first bob
      const jointDef1 = new b2RevoluteJointDef();
      jointDef1.Initialize(
        groundBody,
        bobBody1,
        new b2Vec2(centerX / 30, topY / 30),
      );
      world.CreateJoint(jointDef1);

      // Create revolute joint between first bob and second bob
      const jointDef2 = new b2RevoluteJointDef();
      jointDef2.Initialize(
        bobBody1,
        bobBody2,
        new b2Vec2(centerX / 30, (topY + 100) / 30),
      );
      world.CreateJoint(jointDef2);

      // Apply random torque to all bobs
      const randomTorque1 = (Math.random() - 0.5) * 20;
      bobBody1.ApplyTorque(randomTorque1, true);
      const randomTorque2 = (Math.random() - 0.5) * 20;
      bobBody2.ApplyTorque(randomTorque2, true);

      let lastTime = 0;

      const draw = (time: number) => {
        if (ctx) {
          const deltaTime = (time - lastTime) / 1000;
          lastTime = time;

          world.Step(deltaTime, 6, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw line connecting ground and first bob
          const bobPos1 = bobBody1.GetPosition();
          ctx.beginPath();
          ctx.moveTo(Math.floor(centerX), Math.floor(topY));
          ctx.lineTo(Math.floor(bobPos1.x * 30), Math.floor(bobPos1.y * 30));
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 3;
          ctx.stroke();
          // Draw line connecting first bob and second bob
          const bobPos2 = bobBody2.GetPosition();
          ctx.beginPath();
          ctx.moveTo(Math.floor(bobPos1.x * 30), Math.floor(bobPos1.y * 30));
          ctx.lineTo(Math.floor(bobPos2.x * 30), Math.floor(bobPos2.y * 30));
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Draw ground object as a green circle
          ctx.beginPath();
          ctx.arc(Math.floor(centerX), Math.floor(topY), 10, 0, 2 * Math.PI);
          ctx.fillStyle = 'green';
          ctx.fill();
          ctx.strokeStyle = 'green';
          ctx.stroke();

          // Draw first bob as a red circle
          ctx.beginPath();
          ctx.arc(
            Math.floor(bobPos1.x * 30),
            Math.floor(bobPos1.y * 30),
            10,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.strokeStyle = 'red';
          ctx.stroke();

          // Draw second bob as a blue circle
          ctx.beginPath();
          ctx.arc(
            Math.floor(bobPos2.x * 30),
            Math.floor(bobPos2.y * 30),
            10,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = 'blue';
          ctx.fill();
          ctx.strokeStyle = 'blue';
          ctx.stroke();

          // Draw arc from the pendulum arm between ground object and first bob to the pendulum arm between first bob and second bob
          const startAngle =
            Math.atan2(bobPos1.y - topY / 30, bobPos1.x - centerX / 30) +
            Math.PI;
          const endAngle =
            Math.atan2(bobPos2.y - bobPos1.y, bobPos2.x - bobPos1.x) +
            Math.PI * 2;
          ctx.beginPath();
          ctx.arc(
            Math.floor(bobPos1.x * 30),
            Math.floor(bobPos1.y * 30),
            20,
            startAngle,
            endAngle,
            false,
          );
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw scan lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 0.5;
          for (let y = 0; y < canvas.height; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
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
