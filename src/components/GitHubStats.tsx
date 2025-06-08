"use client";
import { motion } from "framer-motion";
import { FiGithub, FiStar, FiGitBranch, FiUsers } from "react-icons/fi";

export default function GitHubStats() {
  const username = "ERNKLYC";
  
  const stats = [
    { icon: <FiGithub className="w-6 h-6" />, label: "Repositories", value: "20+" },
    { icon: <FiStar className="w-6 h-6" />, label: "Stars", value: "50+" },
    { icon: <FiGitBranch className="w-6 h-6" />, label: "Commits", value: "500+" },
    { icon: <FiUsers className="w-6 h-6" />, label: "Followers", value: "25+" },
  ];

  return (
    <section id="github" className="py-16 bg-gradient-to-br from-[#0F1923] via-[#151F2B] to-[#0F1923] text-white scroll-mt-20">      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white relative z-10">
              GITHUB İSTATİSTİKLERİM
            </h2>
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FF4655] to-transparent"></div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm mt-4">
            GitHub üzerindeki kodlama aktivitelerim ve teknoloji yetkinliklerim
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* GitHub Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1F2731]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20"
          >
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-[#0F1923]/50 rounded-lg">
                  <div className="text-[#FF4655] mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* GitHub Languages Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#1F2731]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#FF4655]/20"
          >
            <h3 className="text-xl font-bold mb-4 text-center">En Çok Kullanılan Diller</h3>
            <div className="space-y-4">
              <img 
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${username}&show_icons=true&locale=en&layout=compact&theme=github_dark&hide_border=true&bg_color=1F2731&title_color=FF4655&text_color=ffffff`}
                alt="GitHub Language Stats"
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Technology Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-6 text-white">🛠 Teknolojiler & Araçlar</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <img src="https://img.shields.io/badge/-Flutter-333333?style=flat&logo=flutter" alt="Flutter" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-Dart-333333?style=flat&logo=dart" alt="Dart" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-Unity-333333?style=flat&logo=unity" alt="Unity" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-C%23-333333?style=flat&logo=c-sharp&logoColor=white" alt="C#" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-HTML5-333333?style=flat&logo=html5" alt="HTML5" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-CSS3-333333?style=flat&logo=css3" alt="CSS3" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-JavaScript-333333?style=flat&logo=javascript" alt="JavaScript" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-C-333333?style=flat&logo=c" alt="C" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-Git-333333?style=flat&logo=git" alt="Git" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-Figma-333333?style=flat&logo=figma" alt="Figma" className="rounded hover:scale-105 transition-transform" />
            <img src="https://img.shields.io/badge/-Photoshop-333333?style=flat&logo=adobe-photoshop" alt="Photoshop" className="rounded hover:scale-105 transition-transform" />
          </div>
        </motion.div>

        {/* Connect Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          <h3 className="text-xl font-bold mb-4 text-white">🌐 Bağlantılar</h3>
          <div className="flex justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/erenklyc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform"
            >
              <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn" className="rounded" />
            </a>
            <a
              href="https://ernklyc.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform"
            >
              <img src="https://img.shields.io/badge/Website-333333?style=flat&logo=google-chrome&logoColor=white" alt="Website" className="rounded" />
            </a>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:scale-105 transition-transform"
            >
              <img src="https://img.shields.io/badge/GitHub-333333?style=flat&logo=github&logoColor=white" alt="GitHub" className="rounded" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
