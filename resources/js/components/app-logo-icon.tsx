import { Leaf } from 'lucide-react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <Leaf strokeWidth={2.25} {...props} />;
}
