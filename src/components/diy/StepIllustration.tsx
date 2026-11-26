import React from 'react';
import { DIYInstructionStep, DIYInstructionIdea } from '@/types';
import { JeansStep1CuttingSvg } from './svgs/JeansStep1CuttingSvg';
import { JeansStep2InsideOutSvg } from './svgs/JeansStep2InsideOutSvg';
import { JeansStep3SewingBottomSvg } from './svgs/JeansStep3SewingBottomSvg';
import { JeansStep4StrapsSvg } from './svgs/JeansStep4StrapsSvg';
import { JeansStep5StrapAttachmentSvg } from './svgs/JeansStep5StrapAttachmentSvg';
import { JeansCompletedToteSvg } from './svgs/JeansCompletedToteSvg';

// Glass Pantry Storage Canisters
import {
  GlassStep1SoakingSvg,
  GlassStep2PasteScrubSvg,
  GlassStep3WipeCleanSvg,
  GlassStep4SterilizationSvg,
  GlassStep5SealingLabelingSvg,
} from './svgs/GlassPantryDiagrams';

// Plastic Bottle Sub-Irrigated Planter
import {
  BottleStep1CuttingSvg,
  BottleStep2SmoothingSvg,
  BottleStep3CapPiercingSvg,
  BottleStep4WickAssemblySvg,
  BottleStep5PlantingReservoirSvg,
} from './svgs/BottlePlanterDiagrams';

// Cardboard Modular Desk Organizer
import {
  CardboardStep1MeasuringSvg,
  CardboardStep2CuttingSvg,
  CardboardStep3InterlockingSlotsSvg,
  CardboardStep4GridAssemblySvg,
} from './svgs/CardboardOrganizerDiagrams';

// Wooden Pallet Patio Lounge Furniture
import {
  PalletStep1StampInspectionSvg,
  PalletStep2NailExtractionSvg,
  PalletStep3SandingSvg,
  PalletStep4AssemblyBoltingSvg,
  PalletStep5WeatherproofCushionSvg,
} from './svgs/PalletFurnitureDiagrams';

// Upcycled T-Shirt Yarn & Braided Plant Hanger
import {
  TshirtStep1DeconstructSvg,
  TshirtStep2RibbonCuttingSvg,
  TshirtStep3TensionStretchingSvg,
  TshirtStep4KnotBasketSvg,
} from './svgs/TshirtMacrameDiagrams';

// Restored Cast Iron Skillet
import {
  CastIronStep1RustStrippingSvg,
  CastIronStep2ThermalDryingSvg,
  CastIronStep3MicroOilBuffingSvg,
  CastIronStep4PolymerizationBakeSvg,
} from './svgs/CastIronSeasoningDiagrams';

// Tin Can Desktop & Tool Caddy
import {
  TinCanStep1DeburringSvg,
  TinCanStep2DrillingHolesSvg,
  TinCanStep3WoodBlockMountingSvg,
  TinCanStep4LeatherHandleSvg,
} from './svgs/TinCanCaddyDiagrams';

// Milk Jug Ergonomic Garden Scoop
import {
  MilkJugStep1InspectionSvg,
  MilkJugStep2DiagonalTapeGuideSvg,
  MilkJugStep3ContourCuttingSvg,
} from './svgs/MilkJugScoopDiagrams';

import { GenericDiyDiagram } from './svgs/GenericDiyDiagram';

export interface StepIllustrationProps {
  step: DIYInstructionStep;
  idea?: DIYInstructionIdea;
  showMeasurements?: boolean;
  showLabels?: boolean;
  className?: string;
  isCompletedView?: boolean;
}

export const StepIllustration: React.FC<StepIllustrationProps> = ({
  step,
  idea,
  showMeasurements = true,
  showLabels = true,
  className = 'w-full h-auto',
  isCompletedView = false,
}) => {
  // 1. Completed Project Full-View Resolution
  if (isCompletedView) {
    const id = idea?.id || '';
    if (id === 'idea-jeans-tote' || id === 'idea-denim-tote' || idea?.category === 'Clothing Upcycling') {
      return <JeansCompletedToteSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-glass-pantry' || id === 'idea-jar') {
      return <GlassStep5SealingLabelingSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-plastic-planter' || id === 'idea-bottle') {
      return <BottleStep5PlantingReservoirSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-cardboard-organizer') {
      return <CardboardStep4GridAssemblySvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-pallet-furniture' || id === 'idea-pallet') {
      return <PalletStep5WeatherproofCushionSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-tshirt-macrame' || id === 'idea-tshirt') {
      return <TshirtStep4KnotBasketSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-cast-iron-seasoning') {
      return <CastIronStep4PolymerizationBakeSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-tin-can-caddy') {
      return <TinCanStep4LeatherHandleSvg showLabels={showLabels} className={className} />;
    }
    if (id === 'idea-jug-scoops') {
      return <MilkJugStep3ContourCuttingSvg showLabels={showLabels} className={className} />;
    }
    return <JeansCompletedToteSvg showLabels={showLabels} className={className} />;
  }

  const key = step.diagramKey || '';
  const projId = idea?.id || '';
  const num = step.stepNumber;

  // -------------------------------------------------------------
  // PROJECT 1: Old Jeans to Denim Market Tote
  // -------------------------------------------------------------
  if (key === 'jeans-step-1' || ((projId === 'idea-jeans-tote' || projId === 'idea-denim-tote' || projId === 'idea-jeans') && num === 1)) {
    return <JeansStep1CuttingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'jeans-step-2' || ((projId === 'idea-jeans-tote' || projId === 'idea-denim-tote' || projId === 'idea-jeans') && num === 2)) {
    return <JeansStep2InsideOutSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'jeans-step-3' || ((projId === 'idea-jeans-tote' || projId === 'idea-denim-tote' || projId === 'idea-jeans') && num === 3)) {
    return <JeansStep3SewingBottomSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'jeans-step-4' || ((projId === 'idea-jeans-tote' || projId === 'idea-denim-tote' || projId === 'idea-jeans') && num === 4)) {
    return <JeansStep4StrapsSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'jeans-step-5' || ((projId === 'idea-jeans-tote' || projId === 'idea-denim-tote' || projId === 'idea-jeans') && num === 5)) {
    return <JeansStep5StrapAttachmentSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 2: Glass Jar to Storage Canisters
  // -------------------------------------------------------------
  if (key === 'glass-step-1' || ((projId === 'idea-glass-pantry' || projId === 'idea-jar') && num === 1)) {
    return <GlassStep1SoakingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'glass-step-2' || ((projId === 'idea-glass-pantry' || projId === 'idea-jar') && num === 2)) {
    return <GlassStep2PasteScrubSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'glass-step-3' || ((projId === 'idea-glass-pantry' || projId === 'idea-jar') && num === 3)) {
    return <GlassStep3WipeCleanSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'glass-step-4' || ((projId === 'idea-glass-pantry' || projId === 'idea-jar') && num === 4)) {
    return <GlassStep4SterilizationSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'glass-step-5' || ((projId === 'idea-glass-pantry' || projId === 'idea-jar') && num === 5)) {
    return <GlassStep5SealingLabelingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 3: Plastic Bottle to Self-Watering Planter
  // -------------------------------------------------------------
  if (key === 'bottle-planter-1' || ((projId === 'idea-plastic-planter' || projId === 'idea-bottle') && num === 1)) {
    return <BottleStep1CuttingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'bottle-planter-2' || ((projId === 'idea-plastic-planter' || projId === 'idea-bottle') && num === 2)) {
    return <BottleStep2SmoothingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'bottle-planter-3' || ((projId === 'idea-plastic-planter' || projId === 'idea-bottle') && num === 3)) {
    return <BottleStep3CapPiercingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'bottle-planter-4' || ((projId === 'idea-plastic-planter' || projId === 'idea-bottle') && num === 4)) {
    return <BottleStep4WickAssemblySvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'bottle-planter-5' || ((projId === 'idea-plastic-planter' || projId === 'idea-bottle') && num === 5)) {
    return <BottleStep5PlantingReservoirSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 4: Cardboard Box to Modular Desk Organizer
  // -------------------------------------------------------------
  if (key === 'cardboard-step-1' || (projId === 'idea-cardboard-organizer' && num === 1)) {
    return <CardboardStep1MeasuringSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'cardboard-step-2' || (projId === 'idea-cardboard-organizer' && num === 2)) {
    return <CardboardStep2CuttingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'cardboard-step-3' || (projId === 'idea-cardboard-organizer' && num === 3)) {
    return <CardboardStep3InterlockingSlotsSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'cardboard-step-4' || (projId === 'idea-cardboard-organizer' && num === 4)) {
    return <CardboardStep4GridAssemblySvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 5: Old Wooden Pallet to Lounge Furniture
  // -------------------------------------------------------------
  if (key === 'pallet-step-1' || ((projId === 'idea-pallet-furniture' || projId === 'idea-pallet') && num === 1)) {
    return <PalletStep1StampInspectionSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'pallet-step-2' || ((projId === 'idea-pallet-furniture' || projId === 'idea-pallet') && num === 2)) {
    return <PalletStep2NailExtractionSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'pallet-step-3' || ((projId === 'idea-pallet-furniture' || projId === 'idea-pallet') && num === 3)) {
    return <PalletStep3SandingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'pallet-step-4' || ((projId === 'idea-pallet-furniture' || projId === 'idea-pallet') && num === 4)) {
    return <PalletStep4AssemblyBoltingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'pallet-step-5' || ((projId === 'idea-pallet-furniture' || projId === 'idea-pallet') && num === 5)) {
    return <PalletStep5WeatherproofCushionSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 6: Old T-Shirt to Macrame Plant Hanger & Yarn
  // -------------------------------------------------------------
  if (key === 'tshirt-step-1' || ((projId === 'idea-tshirt-macrame' || projId === 'idea-tshirt') && num === 1)) {
    return <TshirtStep1DeconstructSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tshirt-step-2' || ((projId === 'idea-tshirt-macrame' || projId === 'idea-tshirt') && num === 2)) {
    return <TshirtStep2RibbonCuttingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tshirt-step-3' || ((projId === 'idea-tshirt-macrame' || projId === 'idea-tshirt') && num === 3)) {
    return <TshirtStep3TensionStretchingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tshirt-step-4' || ((projId === 'idea-tshirt-macrame' || projId === 'idea-tshirt') && num === 4)) {
    return <TshirtStep4KnotBasketSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 7: Restored Seasoned Cast Iron Skillet
  // -------------------------------------------------------------
  if (key === 'castiron-step-1' || (projId === 'idea-cast-iron-seasoning' && num === 1)) {
    return <CastIronStep1RustStrippingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'castiron-step-2' || (projId === 'idea-cast-iron-seasoning' && num === 2)) {
    return <CastIronStep2ThermalDryingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'castiron-step-3' || (projId === 'idea-cast-iron-seasoning' && num === 3)) {
    return <CastIronStep3MicroOilBuffingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'castiron-step-4' || (projId === 'idea-cast-iron-seasoning' && num === 4)) {
    return <CastIronStep4PolymerizationBakeSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 8: Upcycled Tin Can Herb & Cutlery Caddy
  // -------------------------------------------------------------
  if (key === 'tincan-step-1' || (projId === 'idea-tin-can-caddy' && num === 1)) {
    return <TinCanStep1DeburringSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tincan-step-2' || (projId === 'idea-tin-can-caddy' && num === 2)) {
    return <TinCanStep2DrillingHolesSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tincan-step-3' || (projId === 'idea-tin-can-caddy' && num === 3)) {
    return <TinCanStep3WoodBlockMountingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'tincan-step-4' || (projId === 'idea-tin-can-caddy' && num === 4)) {
    return <TinCanStep4LeatherHandleSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // -------------------------------------------------------------
  // PROJECT 9: Ergonomic Garden & Feed Scoops from Milk Jug
  // -------------------------------------------------------------
  if (key === 'milkJug-step-1' || (projId === 'idea-jug-scoops' && num === 1)) {
    return <MilkJugStep1InspectionSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'milkJug-step-2' || (projId === 'idea-jug-scoops' && num === 2)) {
    return <MilkJugStep2DiagonalTapeGuideSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }
  if (key === 'milkJug-step-3' || (projId === 'idea-jug-scoops' && num === 3)) {
    return <MilkJugStep3ContourCuttingSvg showMeasurements={showMeasurements} showLabels={showLabels} className={className} />;
  }

  // Fallback to high-fidelity generic technical blueprint if ever needed
  return (
    <GenericDiyDiagram
      step={step}
      projectCategory={idea?.category}
      showMeasurements={showMeasurements}
      showLabels={showLabels}
      className={className}
    />
  );
};

export const ProjectCompletedIllustration: React.FC<{
  idea?: DIYInstructionIdea;
  className?: string;
  showLabels?: boolean;
}> = ({ idea, className = 'w-full h-full object-contain', showLabels = true }) => {
  return (
    <StepIllustration
      step={{ stepNumber: 1, instruction: '' }}
      idea={idea}
      isCompletedView={true}
      showLabels={showLabels}
      className={className}
    />
  );
};

export default StepIllustration;
