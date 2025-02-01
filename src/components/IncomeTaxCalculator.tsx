"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const IncomeTaxCalculator = () => {
    const [income, setIncome] = useState('');
    const [isSalaried, setIsSalaried] = useState(true);

    const STANDARD_DEDUCTION = 75000; // ₹75,000 standard deduction for both years

    const calculateTaxableIncome = (grossIncome, isSalariedPerson) => {
        if (!isSalariedPerson) return grossIncome;
        return Math.max(0, grossIncome - STANDARD_DEDUCTION);
    };

    const calculateTax2425 = (grossIncome) => {
        let income = parseFloat(grossIncome);
        if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0 };

        // Apply standard deduction for salaried individuals
        const taxableIncome = calculateTaxableIncome(income, isSalaried);
        let remainingIncome = taxableIncome;
        let tax = 0;

        // Calculate tax based on slabs
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

        const cess = tax * 0.04; // 4% Health and Education Cess

        return { tax, cess, taxableIncome };
    };

    const calculateTax2526 = (grossIncome) => {
        let income = parseFloat(grossIncome);
        if (isNaN(income)) return { tax: 0, cess: 0, taxableIncome: 0 };

        // Apply standard deduction for salaried individuals
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

    const formatCurrency = (amount) => {
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
        <div className="max-w-3xl mx-auto p-4">
            <Card className="mb-6">
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

                        <div className="grid md:grid-cols-2 gap-4 mt-6">

                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">FY 2025-26 Tax</h3>
                                <div className="space-y-2">
                                    <p>Gross Income: {formatCurrency(income || 0)}</p>
                                    {isSalaried && (
                                        <p>Standard Deduction: {formatCurrency(STANDARD_DEDUCTION)}</p>
                                    )}
                                    <p>Taxable Income: {formatCurrency(tax2526.taxableIncome)}</p>
                                    <p>Base Tax: {formatCurrency(tax2526.tax)}</p>
                                    <p>Health & Education Cess: {formatCurrency(tax2526.cess)}</p>
                                    <p className="text-2xl text-blue-600 pt-2 border-t">
                                        {formatCurrency(totalTax2526)}
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        Effective Rate: {income ? ((totalTax2526 / parseFloat(income)) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">FY 2024-25 Tax</h3>
                                <div className="space-y-2">
                                    <p>Gross Income: {formatCurrency(income || 0)}</p>
                                    {isSalaried && (
                                        <p>Standard Deduction: {formatCurrency(STANDARD_DEDUCTION)}</p>
                                    )}
                                    <p>Taxable Income: {formatCurrency(tax2425.taxableIncome)}</p>
                                    <p>Base Tax: {formatCurrency(tax2425.tax)}</p>
                                    <p>Health & Education Cess: {formatCurrency(tax2425.cess)}</p>
                                    <p className="text-2xl text-gray-600 pt-2 border-t">
                                        {formatCurrency(totalTax2425)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Effective Rate: {income ? ((totalTax2425 / parseFloat(income)) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Your Tax Savings in FY 2025-26</h3>
                            <p className="text-2xl text-green-600">
                                {formatCurrency(savings)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>FY 2024-25 Tax Slabs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p>• Up to ₹3,00,000: Nil</p>
                            <p>• ₹3,00,001 to ₹7,00,000: 5%</p>
                            <p>• ₹7,00,001 to ₹10,00,000: 10%</p>
                            <p>• ₹10,00,001 to ₹12,00,000: 15%</p>
                            <p>• ₹12,00,001 to ₹15,00,000: 20%</p>
                            <p>• Above ₹15,00,000: 30%</p>
                            <p className="mt-4 text-blue-600">
                                Standard Deduction: ₹75,000 for salaried individuals
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>FY 2025-26 Tax Slabs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <p>• Up to ₹4,00,000: Nil</p>
                            <p>• ₹4,00,001 to ₹8,00,000: 5%</p>
                            <p>• ₹8,00,001 to ₹12,00,000: 10%</p>
                            <p>• ₹12,00,001 to ₹16,00,000: 15%</p>
                            <p>• ₹16,00,001 to ₹20,00,000: 20%</p>
                            <p>• ₹20,00,001 to ₹24,00,000: 25%</p>
                            <p>• Above ₹24,00,000: 30%</p>
                            <p className="mt-4 text-blue-600">
                                Standard Deduction: ₹75,000 for salaried individuals
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default IncomeTaxCalculator;