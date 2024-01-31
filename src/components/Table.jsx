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
    background-color: #222;
    border-radius: 10px;
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
    th {
      background-color: #151515;
      color: #fff;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
      font-weight: normal;
    }
    tr td {
      border-bottom: 1px solid #1a1a1a;
      border-collapse: collapse;
      padding: 0 10px;
      overflow: hidden;
    }
    tr:last-children {
      td {
        border-bottom: none;
      }
    }
  }
`;
