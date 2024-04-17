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
    display: table;
    border-collapse: separate;
    border-spacing: 0;
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
    .table-thead {
      background: rgba(149, 157, 165, 0.16);
      height: 28px;
    }
    th {
      padding: 18px 40px;
      text-align: left;
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      text-align: left;
      font-style: normal;
    }
    th:first-child {
      border-radius: 6px 0 0 6px;
    }
    th:last-child {
      border-radius: 0 6px 6px 0;
    }
    tr td {
      border-bottom: 1px solid #898989;
      border-collapse: collapse;
      overflow: hidden;
    }
    tr:last-children {
      td {
        border-bottom: none;
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
      font-size: 14px;
    }
  }
`;
