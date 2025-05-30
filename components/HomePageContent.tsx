"use client";

import React, { useState, useEffect, useCallback } from "react";
import ArticlesList from "./ArticlesList";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

interface HomePageContentProps {
  articles: Article[];
}

const imageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: {
    scale: 1.1,
    transition: { duration: 0.3, type: "spring", stiffness: 300 },
  },
};

export default function HomePageContent({ articles }: HomePageContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("search") ?? "";
    setSearchTerm(initialSearch);
  }, []);

  const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((term: string) => {
      if (!term) {
        setFilteredArticles(articles);
        return;
      }
      setFilteredArticles(
        articles.filter(
          (article) =>
            article.title.toLowerCase().includes(term.toLowerCase()) ||
            (article.description &&
              article.description.toLowerCase().includes(term.toLowerCase())),
        ),
      );
    }, 300),
    [articles],
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    // leave topics untouched
    const query = params.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [searchTerm, router]);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "var(--container-background)",
        transition: "background-color 0.3s",
        borderRadius: "8px",
      }}
    >
      <header className="page-header">
        <h1 className="page-title">
          Welcome to{" "}
          <span className="color-wave">
            {"DevVerse Tech Blog".split("").map((char, index) =>
              char === " " ? (
                <span key={index} style={{ margin: "0 0.5rem" }}>
                  {char}
                </span>
              ) : (
                <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                  {char}
                </span>
              ),
            )}
          </span>{" "}
          ✨
        </h1>
        <p className="page-description">
          Akash Tech Blog is your go-to source for deep dives into computer
          science and technology. Explore <strong>{articles.length}</strong>{" "}
          articles covering frameworks, libraries, tools, and cutting-edge tech
          innovations. Stay informed, inspired, and ready to tackle the latest
          trends in computer science and software development. 🚀
        </p>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <motion.div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--container-background)",
            border: "2px solid var(--border-color, #ccc)",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            width: isFocused || searchTerm ? "500px" : "400px",
            transition: "width 0.3s ease-in-out, background-color 0.3s ease",
          }}
        >
          <FaSearch
            style={{
              marginRight: "0.75rem",
              color: isFocused ? "#0070f3" : "var(--text-color)",
              transition: "color 0.3s ease",
            }}
          />
          <motion.input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "1rem",
              fontFamily: "inherit",
              backgroundColor: "transparent",
              color: "var(--text-color)",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-48%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1.25rem",
                color: "var(--text-color)",
                lineHeight: 1,
                transition: "transform 0.2s ease, color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-48%) scale(1.2)";
                e.currentTarget.style.color = "#0070f3";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(-48%) scale(1)";
                e.currentTarget.style.color = "var(--text-color)";
              }}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </motion.div>
      </div>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <ArticlesList articles={filteredArticles} />
        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--text-color)",
          }}
        >
          More articles will be added soon. Stay tuned! 🚀
        </p>
      </div>

      {/* Creator Profile Card */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2rem",
          border: "1px solid var(--border-color, #eaeaea)",
          borderRadius: "8px",
          backgroundColor: "var(--container-background)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          About The Creator
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a
            href="https://sonnguyenhoang.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/profile.jpg"
              alt="Profile Picture"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>

          <h3 style={{ color: "var(--text-color)" }}>Akash</h3>

          <p
            style={{
              color: "var(--text-color)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            A passionate developer and tech enthusiast sharing insights and
            expertise on computer science, software development, and emerging
            technologies. Let's connect and build the future together! 👨🏻‍💻
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
            }}
          >
            {[
              {
                href: "https://github.com/MeAkash77",
                icon: <FaGithub />,
              },
              {
                href: "https://www.linkedin.com/in/me-akash77",
                icon: <FaLinkedin />,
              },
              {
                href: "https://akashletsblog.blogspot.com/?m=1",
                icon: <FaGlobe />,
              },
              {
                href: "mailto:iakshu845@gmail.com",
                icon: <FaEnvelope />,
              },
            ].map(({ href, icon }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--link-color)",
                  fontSize: "1.75rem",
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform =
                    "scale(1.2) translateY(-3px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1) translateY(0)")
                }
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Website Info Card */}
      <section
        style={{
          marginTop: "3rem",
          padding: "2rem",
          border: "1px solid var(--border-color, #eaeaea)",
          borderRadius: "8px",
          backgroundColor: "var(--container-background)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "opacity 0.6s ease 0.7s, transform 0.6s ease 0.7s",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          About This Website
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a
            href="https://devverse-swe.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/nextjs.jpeg"
              alt="Profile Picture"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "1rem",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </a>

          <p
            style={{
              color: "var(--text-color)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            This website is built and designed with a <strong>modern</strong>{" "}
            tech stack:{" "}
            <strong>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://mdxjs.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                MDX
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase
              </a>
            </strong>
            ,{" "}
            <strong>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>
            </strong>
            , and{" "}
            <strong>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                TailwindCSS
              </a>
            </strong>
            . It serves as a hub for sharing software engineering insights,
            technical tutorials, and the latest trends in technology. Enjoy a
            fast, modern, and responsive user experience as you explore our
            articles and resources! 🌐
          </p>
        </div>
      </section>
      <style jsx>{`
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeSlideIn 0.6s ease-out;
        }

        .page-title {
          font-size: 2.75rem;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .page-description {
          font-size: 1.125rem;
          color: var(--text-color);
          max-width: 600px;
          margin: 0 auto;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeSlideIn 0.6s ease-out;
        }

        .page-title {
          font-size: 2.75rem;
          margin-bottom: 1rem;
        }

        /* Style for each letter in the color wave */
        .color-wave span {
          display: inline-block;
          color: #ff0000;
          animation: colorWave 3s linear infinite;
          animation-fill-mode: both;
        }

        .page-description {
          font-size: 1.125rem;
          color: var(--text-color);
          max-width: 600px;
          margin: 0 auto;
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes colorWave {
          0% {
            color: #ff0000; /* red */
          }
          25% {
            color: #0000ff; /* blue */
          }
          50% {
            color: #00ff00; /* green */
          }
          75% {
            color: #ff00ff; /* magenta */
          }
          100% {
            color: #ff0000; /* back to red */
          }
        }
      `}</style>
    </div>
  );
}
