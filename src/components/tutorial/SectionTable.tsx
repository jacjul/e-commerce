import React from 'react'

const SectionTable = ({section}) => {
  const rows = Object.entries(section).filter(([key]) => key !== "name")

  const getSingleValue = (value) => {
    if (value !== null && typeof value === "object") {
      const first = Object.values(value)[0]
      return first ?? "-"
    }
    return value ?? "-"
  }

  return (
    <table>
        <caption>{section.name}</caption>
        <tbody>
            {rows.map(([key, value]) => (
                <tr key={key}>
                    <td>{key}</td>
                    <td>{getSingleValue(value)}</td>
                </tr>
            ))}
  
        </tbody>
    </table>
  )
}

export default SectionTable