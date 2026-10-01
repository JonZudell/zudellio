import { toSegments } from '@/lib/markdown';
import Rule30Conway from './widgets/Rule30Conway';
import RuleVisualizer from './widgets/RuleVisualizer';
import SignUpFormDemo from './widgets/SignUpFormDemo';
import Stimmy from './widgets/Stimmy';

function number(props: Record<string, string>, key: string, fallback: number): number {
  const raw = props[key];
  const value = raw === undefined ? NaN : Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function widget(name: string, props: Record<string, string>) {
  switch (name) {
    case 'rule30':
      return (
        <Rule30Conway
          cellSize={number(props, 'cellSize', 6)}
          width={number(props, 'width', 100)}
          height={number(props, 'height', 80)}
        />
      );
    case 'rule-visualizer':
      return <RuleVisualizer ruleNumber={number(props, 'ruleNumber', 30)} />;
    case 'stimmy':
      return (
        <Stimmy
          degreesOfFreedom={number(props, 'degreesOfFreedom', 4)}
          height={number(props, 'height', 480)}
          width={number(props, 'width', 640)}
        />
      );
    case 'signup-form':
      return <SignUpFormDemo />;
    default:
      throw new Error(`Unknown widget in a post: ${name}`);
  }
}

/** A post body: markdown, with the live things dropped in where it asks for them. */
export default function PostBody({ body }: { body: string }) {
  const segments = toSegments(body);
  return (
    <div className="post-body">
      {segments.map((segment, index) =>
        segment.kind === 'html' ? (
          <div key={index} dangerouslySetInnerHTML={{ __html: segment.html }} />
        ) : (
          <div key={index}>{widget(segment.name, segment.props)}</div>
        ),
      )}
    </div>
  );
}
