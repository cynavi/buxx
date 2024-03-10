create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "toDate" timestamp, "fromDate" timestamp)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when "userId" = "ownerId" and "isExpense" = true and date >= "fromDate" and date <= "toDate"
          then amount
          else 0
        end) as expense,
      sum(
        case
          when "userId" = "ownerId" and "isExpense" = false and date >= "fromDate" and date <= "toDate"
          then amount
          else 0
      end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "amountValue" numeric, "amountOperator" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "transactionName" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and lower(name) like '%' || "transactionName" || '%'
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and lower(name) like '%' || "transactionName" || '%'
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "toDate" timestamp, "fromDate" timestamp, "amountValue" numeric, "amountOperator" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and date >= "fromDate" and date <= "toDate"
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and date >= "fromDate" and date <= "toDate"
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "toDate" timestamp, "fromDate" timestamp, "transactionName" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and date >= "fromDate" and date <= "toDate"
            and lower(name) like '%' || "transactionName" || '%'
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and date >= "fromDate" and date <= "toDate"
            and lower(name) like '%' || "transactionName" || '%'
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "amountValue" numeric, "amountOperator" varchar, "transactionName" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and lower(name) like '%' || "transactionName" || '%'
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and lower(name) like '%' || "transactionName" || '%'
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("ownerId" uuid, "toDate" timestamp, "fromDate" timestamp, "amountValue" numeric, "amountOperator" varchar, "transactionName" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = true
            and date >= "fromDate" and date <= "toDate"
            and lower(name) like '%' || "transactionName" || '%'
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "ownerId"
            and "isExpense" = false
            and date >= "fromDate" and date <= "toDate"
            and lower(name) like '%' || "transactionName" || '%'
            and case
              when "amountOperator" = '<' then amount < "amountValue"
              when "amountOperator" = '<=' then amount <= "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '!=' then amount != "amountValue"
              when "amountOperator" = '>' then amount > "amountValue"
              when "amountOperator" = '>=' then amount >= "amountValue"
              else amount = "amountValue"
            end
          then amount
          else 0
        end) as income
    from transactions;
$$;