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

      // Create first pendulum bob
      const bobShape1 = new b2PolygonShape();
      bobShape1.SetAsBox(0.25, 0.25);
      const bobBody1 = createBody(world, b2BodyType.b2_dynamicBody, new b2Vec2(centerX / 30, (centerY - 100) / 30), bobShape1, 1);

      // Create second pendulum bob
      const bobShape2 = new b2PolygonShape();
      bobShape2.SetAsBox(0.25, 0.25);
      const bobBody2 = createBody(world, b2BodyType.b2_dynamicBody, new b2Vec2(centerX / 30, (centerY - 200) / 30), bobShape2, 1);

      // Create third pendulum bob
      const bobShape3 = new b2PolygonShape();
      bobShape3.SetAsBox(0.25, 0.25);
      const bobBody3 = createBody(world, b2BodyType.b2_dynamicBody, new b2Vec2(centerX / 30, (centerY - 300) / 30), bobShape3, 1);

      // Create revolute joint between ground and first bob
      const jointDef1 = new b2RevoluteJointDef();
      jointDef1.Initialize(groundBody, bobBody1, new b2Vec2(centerX / 30, centerY / 30));
      world.CreateJoint(jointDef1);

      // Create revolute joint between first bob and second bob
      const jointDef2 = new b2RevoluteJointDef();
      jointDef2.Initialize(bobBody1, bobBody2, new b2Vec2(centerX / 30, (centerY - 100) / 30));
      world.CreateJoint(jointDef2);

      // Create revolute joint between second bob and third bob
      const jointDef3 = new b2RevoluteJointDef();
      jointDef3.Initialize(bobBody2, bobBody3, new b2Vec2(centerX / 30, (centerY - 200) / 30));
      world.CreateJoint(jointDef3);

      // Apply random torque to all bobs
      const randomTorque1 = (Math.random() - 0.5) * 20;
      bobBody1.ApplyTorque(randomTorque1, true);
      const randomTorque2 = (Math.random() - 0.5) * 20;
      bobBody2.ApplyTorque(randomTorque2, true);
      const randomTorque3 = (Math.random() - 0.5) * 20;
      bobBody3.ApplyTorque(randomTorque3, true);

      let lastTime = 0;

      const draw = (time: number) => {
        if (ctx) {
          const deltaTime = (time - lastTime) / 1000;
          lastTime = time;

          world.Step(deltaTime, 6, 2);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw ground
          ctx.beginPath();
          ctx.rect(centerX - 15, centerY - 1.5, 30, 3);
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw first pendulum bob
          const bobPos1 = bobBody1.GetPosition();
          ctx.beginPath();
          ctx.rect(bobPos1.x * 30 - 7.5, bobPos1.y * 30 - 7.5, 15, 15);
          ctx.fillStyle = '#f00';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw second pendulum bob
          const bobPos2 = bobBody2.GetPosition();
          ctx.beginPath();
          ctx.rect(bobPos2.x * 30 - 7.5, bobPos2.y * 30 - 7.5, 15, 15);
          ctx.fillStyle = '#0f0';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw third pendulum bob
          const bobPos3 = bobBody3.GetPosition();
          ctx.beginPath();
          ctx.rect(bobPos3.x * 30 - 7.5, bobPos3.y * 30 - 7.5, 15, 15);
          ctx.fillStyle = '#00f';
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.stroke();

          // Draw line connecting ground and first bob
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(bobPos1.x * 30, bobPos1.y * 30);
          ctx.strokeStyle = '#00f';
          ctx.stroke();

          // Draw line connecting first bob and second bob
          ctx.beginPath();
          ctx.moveTo(bobPos1.x * 30, bobPos1.y * 30);
          ctx.lineTo(bobPos2.x * 30, bobPos2.y * 30);
          ctx.strokeStyle = '#00f';
          ctx.stroke();

          // Draw line connecting second bob and third bob
          ctx.beginPath();
          ctx.moveTo(bobPos2.x * 30, bobPos2.y * 30);
          ctx.lineTo(bobPos3.x * 30, bobPos3.y * 30);
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