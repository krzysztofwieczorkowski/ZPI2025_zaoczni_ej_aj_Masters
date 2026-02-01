import React from 'react'
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    ReferenceLine,
    Label,
} from 'recharts'

export default function HistogramChart({ bins, ticks, height = 360 }) {
    if (!bins) {
        return <div className="placeholder">Click “Generate histogram” to see the chart.</div>
    }

    return (
        <div style={{ height, pointerEvents: 'none' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bins} margin={{ top: 10, right: 20, left: 0, bottom: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        type="number"
                        dataKey="binCenter"
                        domain={['dataMin', 'dataMax']}
                        ticks={ticks}
                        tickFormatter={(v) => Number(v).toFixed(4)}
                    >
                        <Label value="Daily Rate Change" position="insideBottom" offset={-10} />
                    </XAxis>

                    <YAxis>
                        <Label value="Number of Days" angle={-90} position="insideLeft" />
                    </YAxis>

                    <ReferenceLine x={0} />

                    {/* Set bars to white with a subtle border for contrast on dark card backgrounds */}
                    <Bar dataKey="count" isAnimationActive={false} activeBar={null} fill="#ffffff" stroke="#cccccc" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
