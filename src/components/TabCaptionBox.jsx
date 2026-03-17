import { useState } from "react";

export default function TabCaptionBox({ tabs = [] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="tab-caption-box">
      {/* タブ */}
      <div className="tab-header">
        {tabs.map((t, i) => (
          <button
            key={i}
            className={`tab-btn ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 内容（HTML文字列を描画） */}
      <div
        className="tab-content"
        dangerouslySetInnerHTML={{ __html: tabs[active].content }}
      />

      <style jsx>{`
        .tab-caption-box {
          border: 2px solid #d62828;
          border-radius: 8px;
          background: #fff5f5;
          padding: 0;
          margin: 2rem 0;
        }

        .tab-header {
          display: flex;
          border-bottom: 2px solid #d62828;
        }

        .tab-btn {
          flex: 1;
          padding: 0.6rem 0.8rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #d62828;
          transition: 0.2s;
        }

        .tab-btn.active {
          background: #d62828;
          color: #fff;
        }

        .tab-content {
          padding: 1rem 1.2rem;
          color: #222;
          line-height: 1.7;
        }

        .tab-content ul {
          margin-left: 1.2rem;
        }

        .tab-content li {
          margin-bottom: 0.4rem;
        }
      `}</style>
    </div>
  );
}