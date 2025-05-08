"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import InteractiveCard from "./InteractiveCard";
import { FaTags, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Article {
  slug: string;
  title: string;
  description?: string;
  topics: string[];
}

interface ArticlesListProps {
  articles: Article[];
}

export default function ArticlesList({ articles }: ArticlesListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [visibleTopicsCount, setVisibleTopicsCount] = useState(10);
  const [showOnlyMessage, setShowOnlyMessage] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const allTopics = useMemo(() => {
    const allTopicsSet = new Set<string>();
    articles.forEach((article) =>
      article.topics.forEach((topic) => allTopicsSet.add(topic))
    );
    return Array.from(allTopicsSet).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedTopics.length === 0) return articles;
    return articles.filter((article) =>
      selectedTopics.every((topic) => article.topics.includes(topic))
    );
  }, [articles, selectedTopics]);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const displayedTopics = allTopics.slice(0, visibleTopicsCount);
  const extraTopics = selectedTopics.filter((t) => !displayedTopics.includes(t));
  const topicsToShow = [...displayedTopics, ...extraTopics];
  const totalFiltered = filteredArticles.length;
  const totalDisplayed = displayedArticles.length;

  const allCardElements = useMemo(
    () =>
      filteredArticles.map((article, i) => (
        <div
          key={article.slug}
          className="fade-in-card"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <InteractiveCard {...article} />
        </div>
      )),
    [filteredArticles]
  );

  const displayedCardElements = allCardElements.slice(0, visibleCount);

  const updateURL = (topics: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (topics.length) {
      params.set("topics", topics.join(","));
    } else {
      params.delete("topics");
    }

    setSelectedTopics(topics);
  };

  const toggleTopic = (topic: string) => {
    setVisibleCount(10);
    setSelectedTopics((prev) => {
      const next = prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic];
      updateURL(next);
      return next;
    });
  };

  const clearSelection = () => {
    setVisibleCount(10);
    updateURL([]);
  };

  useEffect(() => {
    if (!initialized) {
      const param = searchParams.get("topics");
      if (param) {
        setSelectedTopics(param.split(","));
      }
      setInitialized(true);
    }
  }, [searchParams, initialized]);

  useEffect(() => {
    if (initialized) {
      const params = new URLSearchParams(window.location.search);
      if (selectedTopics.length) {
        params.set("topics", selectedTopics.join(","));
      } else {
        params.delete("topics");
      }

      const queryString = params.toString();
      const url = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;

      router.replace(url); // FIX: Only pass one argument
    }
  }, [selectedTopics, initialized, router]);

  useEffect(() => {
    if (initialized && articles.length > 0 && filteredArticles.length === 0) {
      router.push("/404");
    }
  }, [filteredArticles, articles.length, initialized, router]);

  const searchTerm = searchParams.get("search") ?? "";

  return (
    <div>
      {/* Filter UI */}
      <div className="fade-slide-up" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div className="filter-header">
          <h2>Filter by Topic</h2>
          <div className="toggle-icon" onClick={() => setShowOnlyMessage((prev) => !prev)}>
            {showOnlyMessage ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </div>
        </div>

        <div className={`filter-description ${showOnlyMessage ? "open" : ""}`} style={{ marginTop: 0 }}>
          <p>
            You can select multiple topics to filter the articles. If you select more than one topic,
            only articles that match all selected topics will be shown. 🧠
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem", marginTop: "1rem", alignItems: "center" }}>
          <button
            className={`topic-btn all-topics ${selectedTopics.length === 0 ? "selected" : ""}`}
            onClick={clearSelection}
          >
            <FaTags style={{ marginRight: "0.5rem" }} />
            All Topics
          </button>

          {topicsToShow.map((topic) => (
            <button
              key={topic}
              className={`topic-btn ${selectedTopics.includes(topic) ? "selected" : ""}`}
              onClick={() => toggleTopic(topic)}
            >
              <FaTags style={{ marginRight: "0.5rem" }} />
              {topic}
            </button>
          ))}

          {selectedTopics.length > 0 && (
            <button className="topic-btn clear-btn" onClick={clearSelection}>
              <FaTimes style={{ marginRight: "0.5rem" }} />
              Clear Selection
            </button>
          )}

          {visibleTopicsCount < allTopics.length && (
            <button
              className="topic-btn more-btn"
              onClick={() => setVisibleTopicsCount((prev) => prev + 10)}
            >
              More Topics ...
            </button>
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="article-grid">{displayedCardElements}</div>

      {/* Load More */}
      {visibleCount < filteredArticles.length && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="load-more-btn" onClick={() => setVisibleCount((prev) => prev + 10)}>
            Load More Articles
            <span className="arrow">↓</span>
          </button>
        </div>
      )}

      {/* Article count or no match message */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        {totalFiltered > 0 ? (
          <p>
            Showing <strong>1 – {totalDisplayed}</strong> of <strong>{totalFiltered}</strong> article
            {totalFiltered === 1 ? "" : "s"}
          </p>
        ) : (
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>No articles found.</p>
            <p>
              We’re sorry — no articles matched
              {searchTerm && <> your search for “<strong>{searchTerm}</strong>”</>}
              {searchTerm && selectedTopics.length > 0 && " and"}
              {selectedTopics.length > 0 && (
                <>
                  {" "}
                  all the topic{selectedTopics.length > 1 ? "s" : ""} “
                  <strong>{selectedTopics.join(", ")}</strong>”
                </>
              )}
              {!searchTerm && selectedTopics.length === 0 && " any criteria"}.
            </p>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        /* Your scoped styles here */
      `}</style>
    </div>
  );
}
