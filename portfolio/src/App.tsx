import { useEffect, useState } from 'react';
import './App.css'
import Navbar from './components/Navbar'
import { X, Mail, Download, Menu } from 'lucide-react';
import LinkedinLogo from './components/LinkedinLogo';
import GithubLogo from './components/GithubLogo';
import InteractiveGrid from './components/InteractiveGrid';
import Game from './components/Game';
import useSnackBar from './hooks/useSnackBar';
import emailjs from '@emailjs/browser';
import { Dialog, type DialogContent } from './components/Dialog';

type ProjectType = {
  name: string;
  description: string;
  technolgies: string[];
  dialogDataId: string;
}

type Skill = {
  name: string;
  description: string;
}

const projects: ProjectType[] = [
  {
    name: 'CrosshairSelector',
    description: 'This is a crosshair application meant to help gamers achieve precise aiming for free.',
    technolgies: ['C#', 'WPF', 'Design Patterns'],
    dialogDataId: '1'
  },
  {
    name: 'Yunikey',
    description: 'A webshop where we sell the best custom keycap sets made from premium, double-shot PBT plastic.',
    technolgies: ['C#', 'ASP.NET Core', 'React', 'TypeScript', 'Tailwind', 'SQLite'],
    dialogDataId: '2'
  },
  {
    name: 'TextEditor',
    description: 'A simple text editor application built with modern web technologies. Supports syntax highlighting in C#, XML and SQL.',
    technolgies: ['C#', 'Blazor', 'Tailwind CSS', 'WPF', 'Design Patterns'],
    dialogDataId: '3'
  },
  {
    name: 'BidWise',
    description: 'A quotation management system for railway companies, designed to streamline the process of creating and managing shipment bids. It allows users to create detailed project estimates, track costs, and generate professional bid proposals.',
    technolgies: ['Python', 'FastAPI', 'REST', 'SQLAlchemy', 'SQLite'],
    dialogDataId: '4'
  },
  {
    name: 'Naive Bayes Classifier',
    description: 'A machine learning implementation of the Naive Bayes algorithm for classification tasks.',
    technolgies: ['C#', 'Design Patterns', 'AI & ML'],
    dialogDataId: '5'
  },
];

const skills: Skill[] = [
  {
    name: 'React',
    description: 'The state of the art frontend framework, used for building dynamic and responsive user interfaces. I have extensive experience with React, including hooks, context API, and performance optimization techniques.'
  },
  {
    name: 'C#',
    description: 'A modern, object-oriented programming language developed by Microsoft. I have extensive experience with C#, including ASP.NET Core and WPF development.'
  },
  {
    name: 'Tailwind CSS',
    description: 'A utility-first CSS framework that allows for rapid UI development. I have extensive experience with Tailwind CSS, including customizing themes and implementing responsive designs.'
  },
  {
    name: 'ASP.NET Core Web Api',
    description: 'A cross-platform, high-performance framework for building modern, cloud-enabled web applications. I have extensive experience with ASP.NET Core Web API, including designing RESTful APIs and implementing authentication and authorization.'
  },
  {
    name: 'Blazor WASM',
    description: 'A framework for building interactive web applications using C# instead of JavaScript. I have extensive experience with Blazor WASM, including creating reusable components and managing state.'
  },
  {
    name: 'Python',
    description: 'A high-level, interpreted programming language known for its simplicity and readability. I have extensive experience with Python, including web development, data analysis, and automation.'
  },
  {
    name: 'AI & ML',
    description: 'Experience with machine learning algorithms and artificial intelligence applications. I have worked on projects involving natural language processing, computer vision, and predictive modeling.'
  },
  {
    name: 'SQL & Databases',
    description: 'Experience with designing and managing relational databases using SQL. I have worked on projects involving database schema design, query optimization, and data migration.'
  },
  {
    name: 'Design Patterns',
    description: 'Experience with common software design patterns and architectural principles. I have applied these patterns to create maintainable and scalable applications.'
  },
  {
    name: '.NET',
    description: 'Experience with the .NET framework for building modern, cloud-enabled web applications. I have extensive experience with ASP.NET Core and Entity Framework.'
  },
  {
    name: 'Blazor Server',
    description: 'Experience with Blazor Server for building interactive web applications using C# instead of JavaScript. I have extensive experience with creating reusable components and managing state.'
  },
  {
    name: 'C# WPF',
    description: 'Experience with Windows Presentation Foundation (WPF) for building desktop applications using C#. I have extensive experience with WPF development, including XAML, data binding, and MVVM pattern.'
  },
]

const dialogContent: Record<string, DialogContent> = {
  "1": { title: 'CrosshairSelector', content: 'A desktop application written in C# and WPF to take advantage of  mature, and stable .NET Desktop App development technologies. This application provides a clean, modern and sleek design so the users can easily create their own custom crosshair\'s to enhance their natural aiming capabilities. I created this application as my first real-world, usable project, and it is set to release to the public very soon. It supports 5 different shapes, multiple crosshairs, switching between the crosshairs with your keyboard, mouse, and Xbox controller.' },
  "2": { title: 'Yunikey', content: 'This project is a full e-commerce platform, where we sell unique, high-quality and cozy keycap sets (currently only in ISO layout). The keycaps are made out of premium double-shot PBT material, to ensure the best typing experience for any user. The webshop\'s backend is written in ASP.Net Core, using Minimal APIs, with a REST based architecture, providing great performance, with very little memory usage. The frontend is written in React, for the best user experience, and the database is SQLite, because of memory limitations on the VPS.' },
  "3": { title: 'Texteditor', content: 'Written in C# using WPF, and Blazor WebView for an easy solution of the syntax highlighting. It supports C#, XML, and SQL for now, and it uses design patterns and principles, for a clean, decoupled and extensible codebase.', githubLink: 'https://github.com/deak-daniel/texteditor' },
  "4": { title: 'BidWise', content: 'A project which started out as a simple click-to-quote app, but it grew into a system that can handle any type of rail-cargo requests, as long as the administrator configures them. Based on the user\'s requirements the application finds the best fitting shipment route, with the given cost, and then provides the details in a clean and easy-to-understand format. The project\'s backend is written in Python using FastAPI, it uses a RESTful protocol to communicate with the frontend, which is a streamlit project.', githubLink: 'https://github.com/deak-daniel/BidWise' },
  "5": { title: 'Naive Bayes Classifier', content: 'The simplest, yet one of the best machine learning algorithms, which is based on pure and simple maths. I implemented this project using C# to deepen my understanding of the machine leraning model.', githubLink: 'https://github.com/deak-daniel/Naive_Bayes_Classifier' },
}

const PUBLIC_KEY = import.meta.env.VITE_EMAIL_SERVICE_PUBLIC_KEY;
const TEMPLATE_KEY = import.meta.env.VITE_EMAIL_TEMPLATE_KEY;
const SERVICE_KEY = import.meta.env.VITE_EMAIL_SERVICE_KEY;

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  const [isNavbarFloating, setNavbarFloating] = useState<boolean>(false);
  const { snackbarMessage, showSnackBar } = useSnackBar();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  function sendEmail(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    emailjs.sendForm(SERVICE_KEY, TEMPLATE_KEY, e.target)
      .then(() => {
        showSnackBar('Thank you for your message!', 3000);
      }, (error: unknown) => {
        showSnackBar('Failed to send message. Please try again later.', 3000);
        return error;
      });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(false);
    }
    setInnerWidth(window.innerWidth);
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY >= 100) {
      setNavbarFloating(true);
    } else {
      setNavbarFloating(false);
    }
  });

  useEffect(() => {
    console.log(dialogContent)
  }, []);

  return (
    <>
      {/* <div className='fixed inset-0 -z-10 bg-spotlight'></div> */}
      <InteractiveGrid />

      {innerWidth < 768 && (
        <div className='fixed left-0 top-0 z-50'>
          <button onClick={() => setSidebarOpen(true)} className='p-2 m-4 rounded-lg bg-[#0b1121] border border-slate-700 text-white z-50'>
            <Menu size={20} />
          </button>
        </div>
      )
      }
      <div className='flex flex-row relative justify-center'>
        {innerWidth >= 768 && <Navbar isFloating={isNavbarFloating} />}
      </div>
      {snackbarMessage && <div className='fixed bottom-10 right-10 p-4 bg-green-600 border border-slate-700 text-white rounded-lg z-50'>{snackbarMessage}</div>}
      {activeDialog && <Dialog dialogProps={dialogContent[activeDialog]} onClose={() => setActiveDialog(null)} />}
      <main className='flex flex-col gap-24 mt-8 lg:w-[50%] md:w-[70%] w-[90%] m-auto min-h-screen'>
        {isSidebarOpen && (
          <div className='fixed inset-0 bg-black/50 z-40' onClick={() => setSidebarOpen(false)}></div>
        )}
        <div className={`fixed top-0 left-0 h-full w-[70%] bg-[#0b1121] z-50 p-8 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className='flex flex-col gap-8 relative'>
            <button onClick={() => setSidebarOpen(false)} className='absolute top-0 right-0 p-2 rounded-lg bg-[#0b1121] border border-slate-700 text-white z-50'>
              <X size={20} />
            </button>
            <a href='#about' className='text-white font-bold text-lg' onClick={() => setSidebarOpen(false)}>About</a>
            <a href='#projects' className='text-white font-bold text-lg' onClick={() => setSidebarOpen(false)}>Projects</a>
            <a href='#skills' className='text-white font-bold text-lg' onClick={() => setSidebarOpen(false)}>Skills</a>
            <a href='#contact' className='text-white font-bold text-lg' onClick={() => setSidebarOpen(false)}>Contact</a>
          </div>
        </div>
        <div className='grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 mt-20 items-center gap-6'>
          <section className='flex flex-col gap-12 tracking-[10%]'>
            <div className='flex flex-row gap-4 items-center'>
              <a href='https://github.com/deak-daniel' target='_blank' rel='noopener noreferrer' className='hover:scale-105 transition-all z-10 text-white'>
                <GithubLogo size={52} />
              </a>
              <a href='https://www.linkedin.com/in/danieldeakakos/' target='_blank' rel='noopener noreferrer' className='hover:scale-105 transition-all z-10 text-white'>
                <LinkedinLogo size={36} />
              </a>
            </div>
            <span className='font-moul text-[40px] tracking-[10%]'>Hi, I'm Daniel.</span>
            <span className='font-mali font-[400] text-[24px] tracking-[10%]'>I’m a Senior Full-Stack Engineer.</span>
            <span className='font-mali font-[400] text-[20px] tracking-[10%]'>I specialize in React, Blazor, and .NET, with a focus on building high-performance systems using C#, TypeScript, Tailwind CSS, and Bootstrap.</span>
            <div className='flex flex-row gap-4'>
              <a className='flex flex-row gap-2 font-[400] items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-105 transition-all z-10 bg-black text-white' href='Daniel_Deak_CV.pdf' download>
                <Download size={20} />
                Download CV
              </a>
              <a href='#contact' className='flex flex-row font-[400] gap-2 items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-105 transition-all bg-gray-200 text-black z-10'>
                <Mail size={20} />
                Contact me
              </a>
            </div>
          </section>
          {(innerWidth >= 768 && innerWidth > 1024) && (
            <div className='flex justify-center w-full'>
              <Game />
            </div>
          )}
        </div>

        <span className='font-moul text-[24px] text-center mt-16 tracking-[10%]' id='about'>About Me</span>

        <section className='grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 text-left z-10 gap-6 place-items-center'>
          <span className='font-mali font-[400] text-[20px] tracking-[10%]'>
            I am a Senior Full-Stack Engineer with over 4 years of professional experience, currently completing a BSc in Computer Science (Minor in AI & Data Science).
            My background spans from low-level Embedded Systems at Knorr-Bremse to high-level enterprise web architecture.
            I specialize in building reliable, AI-integrated financial systems and management platforms using the modern .NET and React ecosystems.
          </span>
          <div className='flex-grow-1'>
            <img src='profilePic.jpg' alt='Profile' className='rounded-full w-68 h-68 object-cover border border-slate-700' />
          </div>
        </section>

        <span className='font-moul text-[24px] text-center mt-16 tracking-[10%]' id='projects'>Projects</span>

        <section className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 text-left z-10 gap-6'>
          {projects.map(project => (
            <div className='flex flex-col border border-slate-700 p-8 gap-4 bg-[#0b1121] rounded-xl hover:border-sky-500 hover:scale-99 transition-all w-auto hover:cursor-pointer z-20'
              onClick={() => setActiveDialog(project.dialogDataId)}>
              <span className='font-bold'>{project.name}</span>
              <span className='text-gray-400 text-wrap grow-1'>{project.description}</span>
              <div className='flex flex-row flex-wrap gap-2'>
                {project.technolgies.map(t => (
                  <div className='p-2 bg-gray-600/50 text-stone-300 rounded-lg'>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>


        <span className='font-moul text-[24px] text-center mt-16 tracking-[10%]' id='skills'>Skills</span>

        <section className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 text-left z-10 gap-6'>
          {skills.map(skill => (
            <div className='flex flex-col border border-slate-700 p-8 gap-4 bg-[#0b1121] rounded-xl hover:border-sky-500 hover:scale-99 transition-all w-auto'>
              <span className='font-bold'>{skill.name}</span>
              <span className='text-gray-400'>{skill.description}</span>
            </div>
          ))}
        </section>

        <span className='font-moul text-[24px] text-center mt-16 tracking-[10%]' id='contact'>Contact</span>

        <section id='contact' className='grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 gap-8 text-left z-10 border border-slate-700 p-16 bg-[#0b1121] rounded-xl mb-20'>
          <div className='flex flex-col gap-12 h-full'>
            <span className='text-gray-600'>I'd happy to connect! Feel free to reach out for project inquiries, collaboration opportunities, or any other questions you may have.</span>
            <div className='flex flex-row gap-4'>
              <a href='mailto:deakdani04@gmail.com' className='flex flex-row gap-2 font-[400] items-center px-6 py-3 rounded-lg hover:scale-105 transition-all z-10 text-white border border-slate-700'>
                <Mail size={20} />
              </a>
              <div className='flex flex-col'>
                <span className='font-bold'>Email</span>
                <span className='text-gray-600'>deakdani04@gmail.com</span>
              </div>
            </div>
            <div className='flex flex-row gap-4'>
              <a href='https://www.linkedin.com/in/danieldeakakos/' target='_blank' rel='noopener noreferrer' className='flex flex-row gap-2 font-[400] items-center px-6 py-3 rounded-lg hover:scale-105 transition-all z-10 text-white border border-slate-700'>
                <LinkedinLogo size={20} />
              </a>
              <div className='flex flex-col'>
                <span className='font-bold'>LinkedIn</span>
                <span className='text-gray-600'>Daniel Deak</span>
              </div>
            </div>
            <div className='flex flex-row gap-4'>
              <a href='https://github.com/deak-daniel' target='_blank' rel='noopener noreferrer' className='flex flex-row gap-2 font-[400] items-center px-6 py-3 rounded-lg hover:scale-105 transition-all z-10 text-white border border-slate-700'>
                <GithubLogo size={20} />
              </a>
              <div className='flex flex-col'>
                <span className='font-bold'>Github</span>
                <span className='text-gray-600'>Daniel Deak</span>
              </div>
            </div>
          </div>
          <form method='post' onSubmit={(e) => sendEmail(e)}>
            <div className='flex flex-col gap-4'>
              <label htmlFor='name' className='font-bold'>Name</label>
              <input type='text' id='name' placeholder='Name' name='name' className='p-3 rounded-lg bg-gray-700/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all' />

              <label htmlFor='email' className='font-bold'>Email</label>
              <input type='email' id='email' name='email' placeholder='Email' className='p-3 rounded-lg bg-gray-700/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all' />

              <label htmlFor='title' className='font-bold'>Title</label>
              <input type='text' name='title' id='title' placeholder='Title' className='p-3 rounded-lg bg-gray-700/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all' />

              <label htmlFor='message' className='font-bold'>Message</label>
              <textarea id='message' name='message' placeholder='Message' className='p-3 rounded-lg bg-gray-700/50 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none h-[150px]' />
              <button type='submit' className=' hover:cursor-pointer flex flex-row font-[400] gap-2 items-center px-6 py-3 border border-slate-700 rounded-lg hover:scale-102 max-w-max transition-all bg-gray-200 text-black z-10'>
                <Mail size={20} />
                Send Message
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}