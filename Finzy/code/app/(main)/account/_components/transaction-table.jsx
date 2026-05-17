"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
// bulk delete

import { toast } from "sonner";
import { BarLoader } from "react-spinners";
// add for recurring transaction
const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {
  // import rounter hook
  const router = useRouter();
  // next push used

  // use funciton for deletation multiple select then delete button show
  const [selectedIds, setSelectedIds] = useState([]);
  // this is for sorting
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  // bulk delete
  const {
    loading:deleteLoading,
    fn:deleteFn,
    data:deleted,

  }=useFetch(bulkDeleteTransactions);


  const filterAndSortTransactions = useMemo(()=>{
    let result = [...transactions];
    // apply search filter
    if(searchTerm){
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transactions)=>
        transactions.description?.toLowerCase().includes(searchLower)
      );
    }
// Apply Reccuring Filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
  }

  // Apply type filter 
  if(typeFilter){
    result = result.filter((transaction)=>transaction.type===typeFilter);
  }

  // apply Sorting 
  result.sort((a,b)=>{
    let comparison = 0
    switch (sortConfig.field) {
      case "date":
        comparison = new Date(a.date) - new Date(b.date);
        break;
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        // localeCompare this is in build function in js
        break;
    
      default:
        comparison = 0;
    }
    return sortConfig.direction ==='asc'?comparison:-comparison;
  })
    return result;
  },[
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig,
  ]);

  // function for sort table data according to date
  const handlesort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item != id)
        : [...current, id],
    );
  };
  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === filterAndSortTransactions.length
        ? []
        : filterAndSortTransactions.map((t) => t.id),
    );
  };

  // Bulk Deletation
  
  const handleBulkDelete= async()=>{
    if(!window.confirm(
            `Hey! Are you Sure you want to delete ${selectedIds.length} transactions?`)
          ){
return;
    }
   deleteFn(selectedIds); 
  };
  
 useEffect(()=>{
    if(deleted && !deleteLoading){
      toast.error("Transactions deleted successfully");
    }
  },[deleted,deleteLoading]);
  // handle filters clear
  const handleClearFilters=()=>{
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 bg-gray-100">
    {deleteLoading &&(
      <BarLoader className="mt-4" width={"100%"} color="#9333ea"/>
      )}
      {/* add different filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* add Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 "
          />
        </div>
        {/* filter type */}
        <div className="flex gap-2">
          {/* this is for type filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* this is for recurringFilter */}
          <Select value={recurringFilter} onValueChange={(value)=>setRecurringFilter(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* show the delete button */}
          {/* Bulk deletation */}
          {selectedIds.length>0 && (
            <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash className="h-4 w-4 mr-2"/>
              Delete Selected({selectedIds.length})
            </Button>
            </div>
          )}
          

          {(searchTerm|| typeFilter|| recurringFilter)&&(
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
              <X className="h-4 w-5"/>
              </Button>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filterAndSortTransactions.length &&
                    filterAndSortTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handlesort("date")}
              >
                <div className="flex items-center">
                  Date{" "}
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handlesort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handlesort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead>{/* This is Empty for delete of edit  */}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filterAndSortTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No Transaction Found
                </TableCell>
              </TableRow>
            ) : (
              filterAndSortTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transaction.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="outline"
                            className="gap-1 bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-200"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction.nextRecurringDate),
                                "PP",
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                        One-Time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          {/* next push update before that */}
                          <DropdownMenuLabel
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(
                                `/transaction/create?edit=${transaction.id}`,
                              )
                            }
                          >
                            Edit
                          </DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {/* also start from here */}
<DropdownMenuLabel
                            className="text-destructive cursor-pointer"
                             onClick={()=>deleteFn([transaction.id])} // this is for bulk deletation
                          >
                            Delete
                          </DropdownMenuLabel>
                          
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
            ;
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
