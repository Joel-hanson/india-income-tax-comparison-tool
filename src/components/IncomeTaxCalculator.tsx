"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const IncomeTaxCalculator = () => {
    const [income, setIncome] = useState<string>('');
    const [isSalaried, setIsSalaried] = useState<boolean>(true);
    const [showSlabs, setShowSlabs] = useState<boolean>(false);

    const STANDARD_DEDUCTION = 75000; // ₹75,000 standard deduction for both years

    const calculateTaxableIncome = (grossIncome: number, isSalariedPerson: boolean): number => {
        if (!isSalariedPerson) return grossIncome;
        return Math.max(0, grossIncome - STANDARD_DEDUCTION);
    };

    interface TaxResult {
        tax: number;
        cess: number;
        taxableIncome: number;
    }

    const calculateTax2425 = (grossIncome: string): TaxResult => {
        const income = parseFloat(grossIncome);
        if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0 };

        const taxableIncome = calculateTaxableIncome(income, isSalaried);
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

        return { tax, cess, taxableIncome };
    };

    const calculateTax2526 = (grossIncome: string): TaxResult => {
        const income = parseFloat(grossIncome);
        if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0 };

        const taxableIncome = calculateTaxableIncome(income, isSalaried);
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

        return { tax, cess, taxableIncome };
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const tax2425 = calculateTax2425(income);
    const tax2526 = calculateTax2526(income);
    const totalTax2425 = tax2425.tax + tax2425.cess;
    const totalTax2526 = tax2526.tax + tax2526.cess;
    const savings = totalTax2425 - totalTax2526;

    return (
        <div className="w-full max-w-3xl mx-auto p-0 md:p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Indian Income Tax Calculator (FY 2024-25 vs 2025-26)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="income">Annual Income (₹)</Label>
                            <Input
                                id="income"
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(e.target.value)}
                                placeholder="Enter your annual income"
                                className="mt-1"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="salaried"
                                checked={isSalaried}
                                onChange={(e) => setIsSalaried(e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="salaried">Salaried Individual (₹75,000 Standard Deduction)</Label>
                        </div>

                        {/* Tax Savings Section */}
                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Your Tax Savings in FY 2025-26</h3>
                            <p className="text-2xl text-green-600">
                                {formatCurrency(savings)}
                            </p>
                        </div>

                        {/* Main comparison section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* FY 2025-26 */}
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg">FY 2025-26 Tax</h3>
                                    <button
                                        onClick={() => setShowSlabs(!showSlabs)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {showSlabs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Gross Income:</span>
                                        <span>{formatCurrency(Number(income) || 0)}</span>
                                    </div>
                                    {isSalaried && (
                                        <div className="flex justify-between">
                                            <span>Standard Deduction:</span>
                                            <span>{formatCurrency(STANDARD_DEDUCTION)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Taxable Income:</span>
                                        <span>{formatCurrency(tax2526.taxableIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Base Tax:</span>
                                        <span>{formatCurrency(tax2526.tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Health & Education Cess:</span>
                                        <span>{formatCurrency(tax2526.cess)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span>Total Tax:</span>
                                        <span className="text-2xl text-blue-600">{formatCurrency(totalTax2526)}</span>
                                    </div>
                                    <div className="text-sm text-blue-600 text-right">
                                        Effective Rate: {income ? ((totalTax2526 / parseFloat(income)) * 100).toFixed(1) : 0}%
                                    </div>
                                </div>

                                {/* Collapsible tax slabs */}
                                <div className={`mt-4 space-y-1 text-sm ${showSlabs ? '' : 'hidden'}`}>
                                    <div className="font-semibold mb-2">Tax Slabs:</div>
                                    <p>• Up to ₹4L: Nil</p>
                                    <p>• ₹4L-8L: 5%</p>
                                    <p>• ₹8L-12L: 10%</p>
                                    <p>• ₹12L-16L: 15%</p>
                                    <p>• ₹16L-20L: 20%</p>
                                    <p>• ₹20L-24L: 25%</p>
                                    <p>• Above ₹24L: 30%</p>
                                </div>
                            </div>

                            {/* FY 2024-25 */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg">FY 2024-25 Tax</h3>
                                    <button
                                        onClick={() => setShowSlabs(!showSlabs)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        {showSlabs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Gross Income:</span>
                                        <span>{formatCurrency(Number(income) || 0)}</span>
                                    </div>
                                    {isSalaried && (
                                        <div className="flex justify-between">
                                            <span>Standard Deduction:</span>
                                            <span>{formatCurrency(STANDARD_DEDUCTION)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Taxable Income:</span>
                                        <span>{formatCurrency(tax2425.taxableIncome)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Base Tax:</span>
                                        <span>{formatCurrency(tax2425.tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Health & Education Cess:</span>
                                        <span>{formatCurrency(tax2425.cess)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span>Total Tax:</span>
                                        <span className="text-2xl text-gray-600">{formatCurrency(totalTax2425)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 text-right">
                                        Effective Rate: {income ? ((totalTax2425 / parseFloat(income)) * 100).toFixed(1) : 0}%
                                    </div>
                                </div>

                                {/* Collapsible tax slabs */}
                                <div className={`mt-4 space-y-1 text-sm ${showSlabs ? '' : 'hidden'}`}>
                                    <div className="font-semibold mb-2">Tax Slabs:</div>
                                    <p>• Up to ₹3L: Nil</p>
                                    <p>• ₹3L-7L: 5%</p>
                                    <p>• ₹7L-10L: 10%</p>
                                    <p>• ₹10L-12L: 15%</p>
                                    <p>• ₹12L-15L: 20%</p>
                                    <p>• Above ₹15L: 30%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IncomeTaxCalculator;
