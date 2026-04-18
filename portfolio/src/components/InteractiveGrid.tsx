import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

// 1. Move the class OUTSIDE the component.
// We pass 'p' (the p5 instance) to the methods that need it.
class Dot {
  homeX: number;
  homeY: number;
  pos: p5.Vector;
  vel: p5.Vector;
  acc: p5.Vector;
  stiffness: number = 0.15;
  damping: number = 0.7;

  constructor(p: p5, x: number, y: number) {
    this.homeX = x;
    this.homeY = y;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
  }

  update(p: p5, mouseRadius: number) {
    const mouse = p.createVector(p.mouseX, p.mouseY);
    
    // Use the instance method p.dist instead of p.Vector.dist
    const distToMouse = p.dist(this.pos.x, this.pos.y, mouse.x, mouse.y);

    if (distToMouse < mouseRadius) {
      // Use p5.Vector.sub (static) or this.pos.copy().sub(mouse)
      const push = p5.Vector.sub(this.pos, mouse);
      push.normalize();
      push.mult(1.5);
      this.acc.add(push);
    }

    const home = p.createVector(this.homeX, this.homeY);
    const spring = p5.Vector.sub(home, this.pos);
    spring.mult(this.stiffness);
    this.acc.add(spring);

    this.vel.add(this.acc);
    this.vel.mult(this.damping);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display(p: p5, mouseRadius: number) {
    const d = p.dist(this.pos.x, this.pos.y, p.mouseX, p.mouseY);
    
    const brightness = p.map(d, 0, mouseRadius, 255, 40, true);
    const size = p.map(d, 0, mouseRadius, 5, 1.5, true);

    p.noStroke();
    p.fill(14, 165, 233, brightness);
    p.circle(this.pos.x, this.pos.y, size);
  }
}

const InteractiveGrid: React.FC = () => {
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let dots: Dot[] = [];
      const gap = 35;
      const mouseRadius = 150;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('display', 'block');
        initGrid();
      };

      const initGrid = () => {
        dots = [];
        for (let x = gap / 2; x < p.width; x += gap) {
          for (let y = gap / 2; y < p.height; y += gap) {
            // Pass 'p' into the constructor here
            dots.push(new Dot(p, x, y));
          }
        }
      };

      p.draw = () => {
        p.clear();
        for (const dot of dots) {
          // Pass 'p' and 'mouseRadius' into the updates
          dot.update(p, mouseRadius);
          dot.display(p, mouseRadius);
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initGrid();
      };
    };

    const p5Instance = new p5(sketch, renderRef.current!);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div 
      ref={renderRef} 
      className="fixed inset-0 -z-10 pointer-events-none" 
    />
  );
};

export default InteractiveGrid;