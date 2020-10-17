import React from 'react';
import styles from './Table.module.css';

export function Table({ columns, rows }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {
            columns.map((c, i) => (
              <th key={c.id || i} style={c.style.header}>
                {c.name}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          rows.map(r => (
            <tr key={r.id}>
              {
                columns.map((c, i) => (
                  <td key={c.id || i} style={c.style.cell}>
                    {c.formatValue ? c.formatValue(r[c.key]) : r[c.key]}
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}
