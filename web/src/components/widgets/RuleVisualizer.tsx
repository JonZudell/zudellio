interface RuleVisualizerProps {
  ruleNumber: number;
}

/**
 * The eight neighbourhoods of a one-dimensional automaton and what the given
 * rule number does with each. Static markup, so it is a server component: the
 * reader gets it with the page and nothing has to hydrate.
 */
export default function RuleVisualizer({ ruleNumber }: RuleVisualizerProps) {
  const bits = ruleNumber
    .toString(2)
    .padStart(8, '0')
    .split('')
    .map((bit) => bit === '1');

  return (
    <section className="widget" aria-label={`Rule ${ruleNumber}`}>
      <h3 className="widget-caption">Rule {ruleNumber}</h3>
      <div className="rule-grid">
        {Array.from({ length: 8 }, (_, index) => {
          const state = 7 - index;
          const neighbourhood = state
            .toString(2)
            .padStart(3, '0')
            .split('')
            .map((bit) => bit === '1');
          const result = bits[index];
          return (
            <div key={state} className="rule-box">
              <p>{state}</p>
              <div className="rule-cells" aria-hidden="true">
                {neighbourhood.map((on, i) => (
                  <span key={i} className="rule-cell" data-on={String(on)} />
                ))}
              </div>
              <div className="rule-cells" aria-hidden="true">
                <span className="rule-cell" style={{ visibility: 'hidden' }} />
                <span className="rule-cell" data-on={String(result)} />
                <span className="rule-cell" style={{ visibility: 'hidden' }} />
              </div>
              <p>
                <span className="sr-only">{`${neighbourhood
                  .map((b) => (b ? 1 : 0))
                  .join('')} becomes `}</span>
                {result ? '1' : '0'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
