import React from 'react';
import { Card } from '../components/ui/Card.jsx';
import { MapPin, ShieldAlert, FlaskConical, ShoppingBag, FolderKanban, Leaf, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';

export const SolutionsPage = () => {
  const solutions = [
    {
      title: 'GIS Land Boundary & Survey Mapping',
      icon: MapPin,
      description: 'Accurately map agricultural parcels and public assets with dynamic polygon drawing, survey number tagging, and GeoJSON geometry storage.',
      points: ['Interactive GIS drawing & editing', 'Khasra/Survey boundary verification', 'Beneficiary (Myself / Someone Else) mapping', 'Admin approval lifecycle'],
    },
    {
      title: 'Tree & Agroforestry Insurance',
      icon: ShieldAlert,
      description: 'Comprehensive risk coverage for single trees, agro-forestry clusters, and large commercial plantations against natural perils.',
      points: ['Species-specific coverage & premium calculation', 'Multi-tree batch inventory capture', 'Evidence-backed mobile claim submission', 'Assigned partner on-field inspection'],
    },
    {
      title: 'Soil Testing & Laboratory Network',
      icon: FlaskConical,
      description: 'Streamlined soil sample collection logistics, accredited laboratory processing, and standardized nutritional parameter reporting.',
      points: ['Sample collection scheduling at farm location', 'Tracking across Requested, In-Lab, Report Ready', 'Standardized pH, N, P, K & Organic Carbon ratings', 'Official downloadable PDF lab certificates'],
    },
    {
      title: 'Government Campaigns & Public Assets',
      icon: FolderKanban,
      description: 'Tools for Gram Panchayats, Nagar Palikas, and Vidhan Sabhas to manage public green assets, run on-demand drives, and monitor area farmers.',
      points: ['Public park and tree inventory tracking', 'On-demand farmer campaign mobilization', 'Jurisdiction-scoped data views', 'Public scheme application support'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Integrated Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          BHUMICRED Solutions
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Built according to strict operational workflows and multi-role sovereign standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {solutions.map((sol, idx) => {
          const Icon = sol.icon;
          return (
            <Card key={idx} className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{sol.title}</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">{sol.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {sol.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/role-select">
                <Button variant="outline" size="sm" className="w-full">
                  Access Portal to Use
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
