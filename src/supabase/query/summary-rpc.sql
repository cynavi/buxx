create or replace function "getTotalIncomeAndExpense"("userId" uuid, "toDate" timestamp, "fromDate" timestamp)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when "userId" = "userId" and "isExpense" = true and date >= "toDate" and date <= "fromDate"
          then amount
          else 0
        end) as expense,
      sum(
        case
          when "userId" = "userId" and "isExpense" = false and date >= "toDate" and date <= "fromDate"
          then amount
          else 0
      end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("userId" uuid, "amountValue" numeric, "amountOperator" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
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
            "userId" = "userId"
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

create or replace function "getTotalIncomeAndExpense"("userId" uuid, name varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = true
            and lower(name) like '%' || name || '%'
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = false
            and lower(name) like '%' || name || '%'
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("userId" uuid, "toDate" timestamp, "fromDate" timestamp, "amountValue" numeric, "amountOperator" varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = true
            and date >= "toDate" and date <= "fromDate"
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
            "userId" = "userId"
            and "isExpense" = false
            and date >= "toDate" and date <= "fromDate"
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

create or replace function "getTotalIncomeAndExpense"("userId" uuid, "toDate" timestamp, "fromDate" timestamp, name varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = true
            and date >= "toDate" and date <= "fromDate"
            and lower(name) like '%' || name || '%'
          then amount
          else 0
        end) as expense,
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = false
            and date >= "toDate" and date <= "fromDate"
            and lower(name) like '%' || name || '%'
          then amount
          else 0
        end) as income
    from transactions;
$$;

create or replace function "getTotalIncomeAndExpense"("userId" uuid, "amountValue" numeric, "amountOperator" varchar, name varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = true
            and lower(name) like '%' || name || '%'
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
            "userId" = "userId"
            and "isExpense" = false
            and lower(name) like '%' || name || '%'
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

create or replace function "getTotalIncomeAndExpense"("userId" uuid, "toDate" timestamp, "fromDate" timestamp, "amountValue" numeric, "amountOperator" varchar, name varchar)
returns table (expense numeric, income numeric)
language sql
as $$
    select
      sum(
        case
          when
            "userId" = "userId"
            and "isExpense" = true
            and date >= "toDate" and date <= "fromDate"
            and lower(name) like '%' || name || '%'
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
            "userId" = "userId"
            and "isExpense" = false
            and date >= "toDate" and date <= "fromDate"
            and lower(name) like '%' || name || '%'
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