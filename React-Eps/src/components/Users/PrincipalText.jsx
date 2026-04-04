import React from "react";
import MuiIcon from "../UI/MuiIcon";

export default function PrincipalText({ icon, text, number }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary dark:bg-primary/50 dark:text-blue-400">
                <MuiIcon name={icon} sx={{ fontSize: '1.875rem' }} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {text}{" "}
                    {number !== undefined && (
                        <span className="text-neutral-gray-text dark:text-gray-300 font-medium">(Total: {number})</span>
                    )}
                </h2>
            </div>
        </div>
    )
}
