import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Pagination from "rc-pagination";
import localeInfo from "../../node_modules/rc-pagination/es/locale/en_US";

function Header({ className, current, total, pageSize, onChange }) {
  const [curr, setCurr] = useState(current);
  const onPagerChange = (c) => {
    setCurr(c);
    console.log(c);
    onChange(c);
  };
  useEffect(() => {
    setCurr(current);
  }, [current]);
  return (
    <div className={className}>
      <Pagination
        locale={localeInfo}
        current={curr}
        total={total}
        pageSize={pageSize}
        onChange={onPagerChange}
        showQuickJumper={false}
        className="pager-bar"
      />
    </div>
  );
}

export default styled(Header)`
  .pager-bar {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    padding: 80px 20px;
    li {
      list-style: none;
      height: 40px;
      line-height: 40px;
      margin: 3px;
      background-color: rgba(34, 34, 34, 1);
      color: white;
      border-radius: 8px;
      min-width: 40px;
      text-align: center;
      display: block;
      overflow: hidden;
      font-size: 13px;
      cursor: pointer;
    }
    li:hover {
      background-color: rgb(69 68 68);
    }
    .rc-pagination-item-active,
    .rc-pagination-item-active:hover {
      background-color: #0aab50;
    }
    .rc-pagination-prev {
      button {
        background-color: #222;
        padding: 0 12px;
        margin: 0;
        outline: none;
        border: none;
        color: #0aab50;
        cursor: pointer;
      }
      button::before {
        content: "Prev";
      }
    }
    .rc-pagination-next {
      button {
        background-color: #222;
        padding: 0 12px;
        margin: 0;
        outline: none;
        border: none;
        color: #0aab50;
        cursor: pointer;
      }
      button::before {
        content: "Next";
      }
    }
    .rc-pagination-jump-prev,
    .rc-pagination-jump-next {
      button {
        background-color: #222;
        padding: 0 12px;
        margin: 0;
        outline: none;
        border: none;
        color: #94d6e2;
        cursor: pointer;
      }
      button::before {
        content: "...";
      }
    }
    .rc-pagination-options {
      display: none;
    }
    .rc-pagination-disabled {
      color: #333 !important;
      button {
        color: #333 !important;
        cursor: default;
      }
    }
  }
`;
