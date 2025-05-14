'use client';

import React, { useEffect, useRef } from 'react';

// 定义 Particle 类型，用于粒子背景
interface ParticleType {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// 科技风格网格背景组件
export function TechGridBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-full max-w-7xl overflow-hidden md:h-[370px]">
        <div className="tech-gradient absolute inset-0 h-[100%] w-full"></div>
      </div>
    </div>
  );
}

// 流动粒子背景
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: ParticleType[] = [];
    
    // 创建粒子实例的工厂函数
    function createParticle(): ParticleType {
      if (!canvas) return createEmptyParticle(); // 安全检查
      
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 2 + 0.5;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      
      // 随机使用科技感颜色
      const colors = [
        'rgba(0, 128, 255, 0.3)',  // 蓝色
        'rgba(0, 255, 128, 0.3)',  // 绿色
        'rgba(128, 0, 255, 0.3)',  // 紫色
      ];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        x,
        y,
        size,
        speedX,
        speedY,
        color,
        update() {
          if (!canvas) return; // 安全检查
          
          this.x += this.speedX;
          this.y += this.speedY;
          
          // 边界检查
          if (this.x < 0 || this.x > canvas.width) {
            this.speedX = -this.speedX;
          }
          
          if (this.y < 0 || this.y > canvas.height) {
            this.speedY = -this.speedY;
          }
        },
        draw(ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    }
    
    // 创建一个空的粒子（用于处理边缘情况）
    function createEmptyParticle(): ParticleType {
      return {
        x: 0,
        y: 0,
        size: 0,
        speedX: 0,
        speedY: 0,
        color: 'transparent',
        update() {},
        draw() {}
      };
    }
    
    // 调整画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function initParticles() {
      particles = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }
    
    function connectParticles() {
      if (!ctx) return;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    function animate() {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 -z-20 opacity-50" />;
}

// 科技风格圆环装饰
export function TechCircleDecoration({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-400/20 animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-[500px] h-[500px] rounded-full border border-green-400/10 animate-[spin_25s_linear_reverse_infinite]" />
      <div className="absolute w-[700px] h-[700px] rounded-full border border-purple-400/10 animate-[spin_30s_linear_infinite]" />
      <div className="absolute w-[120px] h-[120px] rounded-full bg-blue-500/5 animate-pulse" />
    </div>
  );
}

// 科技感锚点装饰
export function TechAnchors() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-70" style={{animationDuration: '3s'}} />
      <div className="absolute top-1/4 right-20 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-70" style={{animationDelay: '0.5s', animationDuration: '4s'}} />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-70" style={{animationDelay: '1s', animationDuration: '5s'}} />
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-70" style={{animationDelay: '1.5s', animationDuration: '3.5s'}} />
    </div>
  );
}
