"use client"

import { 
  Alert, 
  AlertDescription,
  AlertTitle 
} from '@/components/ui/alert';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  ChevronDown, 
  ChevronUp, 
  InfoIcon, 
  WalletIcon, 
  BadgeIndianRupee,
  Landmark 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Constants
const STANDARD_DEDUCTION = 75000; // ₹75,000 standard deduction for both years
const REBATE_LIMIT_2425 = 700000;  // 7 lakh rebate for FY 2024-25
const REBATE_LIMIT_2526 = 1200000; // 12 lakh rebate for FY 2025-26

// Types
interface TaxResult {
  tax: number;
  cess: number;
  taxableIncome: number;
  isRebateApplicable: boolean;
  afterTaxIncome: number;
}

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateTaxableIncome = (grossIncome: number, isSalariedPerson: boolean): number => {
  if (!isSalariedPerson) return grossIncome;
  return Math.max(0, grossIncome - STANDARD_DEDUCTION);
};

const IncomeTaxCalculator = () => {
  // State
  const [income, setIncome] = useState<string>('');
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [showSlabs, setShowSlabs] = useState<boolean>(false);
  
  // Tax calculation functions
  const calculateTax2425 = useMemo(() => (grossIncome: string): TaxResult => {
    const income = parseFloat(grossIncome);
    if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0, isRebateApplicable: false, afterTaxIncome: 0 };

    const taxableIncome = calculateTaxableIncome(income, isSalaried);

    const isRebateApplicable = taxableIncome <= REBATE_LIMIT_2425;
    if (isRebateApplicable) {
      return { tax: 0, cess: 0, taxableIncome, isRebateApplicable, afterTaxIncome: income };
    }

    let remainingIncome = taxableIncome;
    let tax = 0;

    if (remainingIncome > 1500000) {
      tax += (remainingIncome - 1500000) * 0.30;
      remainingIncome = 1500000;
    }

    if (remainingIncome > 1200000) {
      tax += Math.min(remainingIncome - 1200000, 300000) * 0.20;
      remainingIncome = 1200000;
    }

    if (remainingIncome > 1000000) {
      tax += Math.min(remainingIncome - 1000000, 200000) * 0.15;
      remainingIncome = 1000000;
    }

    if (remainingIncome > 700000) {
      tax += Math.min(remainingIncome - 700000, 300000) * 0.10;
      remainingIncome = 700000;
    }

    if (remainingIncome > 300000) {
      tax += Math.min(remainingIncome - 300000, 400000) * 0.05;
    }

    const cess = tax * 0.04;
    const totalTax = tax + cess;
    const afterTaxIncome = income - totalTax;

    return { tax, cess, taxableIncome, isRebateApplicable, afterTaxIncome };
  }, [isSalaried]);

  const calculateTax2526 = useMemo(() => (grossIncome: string): TaxResult => {
    const income = parseFloat(grossIncome);
    if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0, isRebateApplicable: false, afterTaxIncome: 0 };

    const taxableIncome = calculateTaxableIncome(income, isSalaried);

    // Check if eligible for rebate
    const isRebateApplicable = taxableIncome <= REBATE_LIMIT_2526;
    if (isRebateApplicable) {
      return { tax: 0, cess: 0, taxableIncome, isRebateApplicable, afterTaxIncome: income };
    }

    let remainingIncome = taxableIncome;
    let tax = 0;

    if (remainingIncome > 2400000) {
      tax += (remainingIncome - 2400000) * 0.30;
      remainingIncome = 2400000;
    }

    if (remainingIncome > 2000000) {
      tax += Math.min(remainingIncome - 2000000, 400000) * 0.25;
      remainingIncome = 2000000;
    }

    if (remainingIncome > 1600000) {
      tax += Math.min(remainingIncome - 1600000, 400000) * 0.20;
      remainingIncome = 1600000;
    }

    if (remainingIncome > 1200000) {
      tax += Math.min(remainingIncome - 1200000, 400000) * 0.15;
      remainingIncome = 1200000;
    }

    if (remainingIncome > 800000) {
      tax += Math.min(remainingIncome - 800000, 400000) * 0.10;
      remainingIncome = 800000;
    }

    if (remainingIncome > 400000) {
      tax += Math.min(remainingIncome - 400000, 400000) * 0.05;
    }

    const cess = tax * 0.04; // 4% Health and Education Cess
    const totalTax = tax + cess;
    const afterTaxIncome = income - totalTax;

    return { tax, cess, taxableIncome, isRebateApplicable, afterTaxIncome };
  }, [isSalaried]);

  // Computed values from tax calculations
  const tax2425 = useMemo(() => calculateTax2425(income), [calculateTax2425, income]);
  const tax2526 = useMemo(() => calculateTax2526(income), [calculateTax2526, income]);
  const totalTax2425 = tax2425.tax + tax2425.cess;
  const totalTax2526 = tax2526.tax + tax2526.cess;
  const savings = totalTax2425 - totalTax2526;
  
  // Calculate monthly values for after-tax income
  const monthlyAfterTax2425 = tax2425.afterTaxIncome / 12;
  const monthlyAfterTax2526 = tax2526.afterTaxIncome / 12;

  // Components
  interface TaxCardProps {
    year: string;
    taxResult: TaxResult;
    totalTax: number;
    monthlyAfterTax: number;
    isActive?: boolean;
  }
  
  const TaxCard = ({ 
    year, 
    taxResult, 
    totalTax, 
    monthlyAfterTax, 
    isActive = false 
  }: TaxCardProps) => {
    const { taxableIncome, isRebateApplicable, tax, cess, afterTaxIncome } = taxResult;
    // const rebateLimit = year === "2425" ? REBATE_LIMIT_2425 : REBATE_LIMIT_2526;
    const rebateText = year === "2425" ? "7 lakh" : "12 lakh";
    const colorClass = year === "2425" ? "text-gray-600" : "text-blue-600";
    const bgClass = year === "2425" ? "bg-gray-50" : "bg-blue-50";
    const accentColor = year === "2425" ? "border-gray-200" : "border-blue-200";
    
    return (
      <Card className={`border ${isActive ? "border-blue-500 shadow-md" : ""} ${bgClass}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              FY 20{year.slice(0,2)}-{year.slice(2,4)} Tax
            </CardTitle>
            {isActive && <Badge variant="secondary">New Regime</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between truncate">
              <span className="mr-2 text-muted-foreground font-light">Gross Income:</span>
              <span className="font-light">{formatCurrency(Number(income) || 0)}</span>
            </div>
            
            {isSalaried && (
              <div className="flex justify-between truncate">
                <span className="mr-2 text-muted-foreground font-light">Standard Deduction:</span>
                <span className="font-light">{formatCurrency(STANDARD_DEDUCTION)}</span>
              </div>
            )}
            
            <div className="flex justify-between truncate">
              <span className="mr-2 text-muted-foreground font-light">Taxable Income:</span>
              <span className="font-light">{formatCurrency(taxableIncome)}</span>
            </div>
            
            <Separator className={accentColor} />
            
            {isRebateApplicable ? (
              <div className="py-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  No tax - Eligible for rebate (≤ ₹{rebateText})
                </Badge>
              </div>
            ) : (
              <>
                <div className="flex justify-between truncate">
                  <span className="mr-2 text-muted-foreground font-light">Base Tax:</span>
                  <span className="font-light">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between truncate">
                  <span className="mr-2 text-muted-foreground font-light">Health & Education Cess:</span>
                  <span className="font-light">{formatCurrency(cess)}</span>
                </div>
              </>
            )}
            
            <Separator className={accentColor} />
            
            <div className="flex justify-between items-center pt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 text-muted-foreground">
                    Total Tax <InfoIcon className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Total tax including 4% Health and Education Cess
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className={`font-semibold text-lg ${colorClass}`}>{formatCurrency(totalTax)}</span>
            </div>
            
            <div className="flex justify-between items-center font-light">
                <span className='text-muted-foreground'>After-Tax Income (Annual):</span>
                <span className={`font-light ${colorClass}`}>{formatCurrency(afterTaxIncome)}</span>
            </div>
            <div className="flex justify-between items-center font-light">
              <span className="text-muted-foreground">Monthly Take-Home:</span>
              <span className={`font-light ${colorClass}`}>{formatCurrency(monthlyAfterTax)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  interface TaxSlabsInfoProps {
    regime: string;
  }
  
  const TaxSlabsInfo = ({ regime }: TaxSlabsInfoProps) => {
    const slabs = regime === "2425" ? [
      { range: "Up to ₹3 lakh", rate: "Nil" },
      { range: "₹3 lakh to ₹7 lakh", rate: "5%" },
      { range: "₹7 lakh to ₹10 lakh", rate: "10%" },
      { range: "₹10 lakh to ₹12 lakh", rate: "15%" },
      { range: "₹12 lakh to ₹15 lakh", rate: "20%" },
      { range: "Above ₹15 lakh", rate: "30%" }
    ] : [
      { range: "Up to ₹4 lakh", rate: "Nil" },  
      { range: "₹4 lakh to ₹8 lakh", rate: "5%" },
      { range: "₹8 lakh to ₹12 lakh", rate: "10%" },
      { range: "₹12 lakh to ₹16 lakh", rate: "15%" },
      { range: "₹16 lakh to ₹20 lakh", rate: "20%" },
      { range: "₹20 lakh to ₹24 lakh", rate: "25%" },
      { range: "Above ₹24 lakh", rate: "30%" }
    ];
    
    return (
      <div className="text-sm mt-2 border rounded-md p-3 bg-gray-50">
        <h4 className="font-medium mb-2">Tax Slabs for FY 20{regime.slice(0,2)}-{regime.slice(2,4)}</h4>
        <div className="space-y-1">
          {slabs.map((slab, index) => (
            <div key={index} className="flex justify-between">
              <span>{slab.range}</span>
              <span className="font-medium">{slab.rate}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-muted-foreground text-xs">
          * Plus 4% Health and Education Cess on tax
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BadgeIndianRupee className="h-6 w-6" />
            Income Tax Calculator
          </h2>
          <p className="text-muted-foreground">
            Compare your income tax under the new tax regime for FY 2024-25 vs. FY 2025-26
          </p>
        </div>

        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <InfoIcon className="h-4 w-4" />
            Information
          </AlertTitle>
          <AlertDescription>
            This calculator is based on the new tax regime only. For FY 2025-26, it uses the structure
            announced in Budget 2025. For accurate tax planning, please consult a tax professional.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              Your Income Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="income">Annual Gross Income (₹)</Label>
              <Input
                id="income"
                placeholder="Enter your annual income"
                type="number"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="salaried" 
                checked={isSalaried} 
                onCheckedChange={(checked: boolean | 'indeterminate') => setIsSalaried(checked === true)}
              />
              <Label htmlFor="salaried" className="text-base">
                I am a salaried employee
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Salaried employees are eligible for standard deduction of ₹75,000
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {income && !isNaN(Number(income)) && Number(income) > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TaxCard 
                year="2425"
                taxResult={tax2425}
                totalTax={totalTax2425}
                monthlyAfterTax={monthlyAfterTax2425}
              />
              <TaxCard 
                year="2526"
                taxResult={tax2526}
                totalTax={totalTax2526}
                monthlyAfterTax={monthlyAfterTax2526}
                isActive={true}
              />
            </div>

            {savings > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-700">Tax Savings for FY 2025-26</AlertTitle>
                <AlertDescription className="text-green-700">
                  You will save {formatCurrency(savings)} in taxes under the new FY 25-26 regime compared to FY 24-25.
                </AlertDescription>
              </Alert>
            )}

            <Collapsible
              open={showSlabs}
              onOpenChange={setShowSlabs}
              className="border rounded-lg p-4"
            >
              <CollapsibleTrigger className="flex w-full justify-between items-center">
                <span className="font-medium">View Tax Slabs</span>
                {showSlabs ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Tabs defaultValue="2526">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="2425">FY 2024-25</TabsTrigger>
                    <TabsTrigger value="2526">FY 2025-26</TabsTrigger>
                  </TabsList>
                  <TabsContent value="2425">
                    <TaxSlabsInfo regime="2425" />
                  </TabsContent>
                  <TabsContent value="2526">
                    <TaxSlabsInfo regime="2526" />
                  </TabsContent>
                </Tabs>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;