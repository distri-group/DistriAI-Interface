import styled from "styled-components";
import { CircularProgress } from "@mui/material";

function Table({ className, columns, list, loading, empty }) {
  return (
    <div className={className}>
      <table className="mytable">
        <thead className="table-thead">
          <tr>
            {columns.map((c) => {
              return (
                <th key={c.title} style={{ width: c.width }}>
                  {c.title}
                </th>
              );
            })}
          </tr>
        </thead>
        {(list && list.length === 0) || loading ? (
          <tbody>
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                {loading ? (
                  <div className="spin-box">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="empty-box">{empty}</div>
                )}
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {list &&
              list.map((d, index) => {
                return (
                  <tr key={index}>
                    {columns.map((c, i) => {
                      if (c.render) {
                        return (
                          <td style={{ width: c.width }} key={i}>
                            {c.render(d[c.key], d, i)}
                          </td>
                        );
                      } else {
                        return (
                          <td key={i} style={{ width: c.width }}>
                            {d[c.key]}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default styled(Table)`
  .mytable {
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0 24px;
    margin-top: -24px;
    width: 100%;
    overflow: hidden;
    .link {
      color: #fff;
      cursor: pointer;
    }
    .btn-link {
      color: #fff;
      cursor: pointer;
      text-decoration: underline;
    }
    thead {
      background: rgba(149, 157, 165, 0.16);
      border-radius: 6px;
      height: 64px;
      tr {
        th {
          &:first-child {
            padding-left: 40px;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
          &:last-child {
            padding-right: 40px;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
    th {
      height: 40px;
      line-height: 40px;
      text-align: left;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }
    tr {
      td {
        padding-bottom: 24px;
        border-bottom: 1px solid #1a1a1a;
        border-collapse: collapse;
        overflow: hidden;
        &:first-child {
          padding-left: 40px;
        }
        &:last-child {
          padding-right: 40px;
        }
      }
      &:last-child {
        td {
          border-bottom: none;
        }
      }
    }
    tbody {
      tr {
        padding-bottom: 24px;
      }
    }
  }
  .empty-box {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: #6e6e6e;
      font-size: 20px;
    }
  }
`;
