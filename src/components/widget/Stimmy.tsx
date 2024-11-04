import React, { useEffect, useRef } from 'react';
import { b2World, b2Vec2, b2BodyDef, b2BodyType, b2PolygonShape, b2RevoluteJointDef, b2Body } from '@flyover/box2d';

const Stimmy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createBody = (world: b2World, type: b2BodyType, position: b2Vec2, shape: b2PolygonShape, density: number): b2Body => {
    const bodyDef = new b2BodyDef();
    bodyDef.type = type;
    bodyDef.position.Set(position.x, position.y);
    const body = world.CreateBody(bodyDef);
    body.CreateFixture(shape, density);
    return body;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const world = new b2World(new b2Vec2(0, 10));
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Create ground
      const groundShape = new b2PolygonShape();
      groundShape.SetAsBox(0.5, 0.05);
      const groundBody = createBody(world, b2BodyType.b2_staticBody, new b2Vec2(centerX / 30, centerY / 30), groundShape, 0);

      // Create pendulum bob
      const bobShape = new b2PolygonShape();
      bobShape.SetAsBox(0.25, 0.25);
      const bobBody = createBody(world, b2BodyType.b2_dynamicBody, new b2Vec2(centerX / 30, (centerY - 100) / 30), bobShape, 1);

      // Create revolute joint
      const jointDef = new b2RevoluteJointDef();
      jointDef.Initialize(groundBody, bobBody, new b2Vec2(centerX / 30, centerY / 30));
      world.CreateJoint(jointDef);

      // Apply random torque
      const randomTorque = (Math.random() - 0.5) * 20;
      bobBody.ApplyTorque(randomTorque, true);

      const draw = (time: number) => {
        if (ctx) {
          world.Step(1 / 60, 6, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw ground
          ctx.beginPath();
          ctx.rect(centerX - 15, centerY - 1.5, 30, 3);
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw pendulum bob
          const bobPos = bobBody.GetPosition();
          ctx.beginPath();
          ctx.rect(bobPos.x * 30 - 7.5, bobPos.y * 30 - 7.5, 15, 15);
          ctx.fillStyle = '#f00';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw line connecting pin and bob
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(bobPos.x * 30, bobPos.y * 30);
          ctx.strokeStyle = '#00f';
          ctx.stroke();
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
      width={800}
      height={600}
      style={{ width: '100%', height: '300px' }}
    >
    </canvas>
  );
};

export default Stimmy;