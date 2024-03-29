import cx from 'classnames';

interface Column<T> {
  label: string;
  getKey: (row: Record<string, any>) => string;
  getContent: (row: Record<string, any>, context?: T) => React.ReactNode;
}

interface SimpleTableProps<T> {
  context?: T;
  columns: Column<T>[];
  data: Record<string, any>[];
  disableHighlight?: boolean;
  getRowId: (row: Record<string, any>) => string;
}

export function SimpleTable<T>({
  columns,
  data,
  context,
  disableHighlight,
  getRowId,
}: SimpleTableProps<T>) {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm dark:text-white font-light">
              <thead className="border-b font-medium">
                <tr>
                  {columns.map((column) => (
                    <th key={column.label} scope="col" className="px-6 py-4">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={getRowId(row)}
                    className={cx(
                      'border-b transition duration-300 ease-in-out',
                      { ['hover:bg-neutral-100']: !disableHighlight }
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.getKey(row)}
                        className="whitespace-nowrap px-6 py-4"
                      >
                        {column.getContent(row, context)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="flex justify-center py-2 italic">No entries</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
