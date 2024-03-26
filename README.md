# Buxx
Simplifies income and expense tracking for efficient financial management.

## Tech Stack

- Typescript - Language
- Angular - Framework
- Tailwind - CSS
- Angular Material - UI Components
- Supabase - Authentication and Database (PostgreSQL)
- Netlify - Hosting
- Nx - CI

## Getting Started

### Prerequisites

Before you fire up dev server, you need to setup supabase configuration:

### 1. Create Supabase project
Headover to [supabase](https://supabase.com/) and start (create) your project.

### 2. Creating table
On your project dashboard go to sql editor and run the following query:
<details>
<summary>SQL</summary>

```sql
create table transactions (
  id uuid default gen_random_uuid(),
  "userId" uuid references auth.users not null,
  name varchar(50) not null,
  date timestamp not null,
  amount numeric(20, 3) not null,
  "isExpense" boolean not null,
  details text,
  primary key(id)
);
````
</details>


### 3. Configuring row level security
Row level security allows to you to control which users are permitted to perform select/insert/update/delete
statements on specific rows within tables and views.

<details>
<summary>SQL</summary>

```sql
alter table transactions enable row level security;

create policy "Authenticated users can insert" on transactions for insert to authenticated with check (true);

create policy "Users can view their own transaction" on transactions
  for select using (auth.uid() = "userId");

create policy "Users can delete their own transaction" on transactions
  for delete using (auth.uid() = "userId");

create policy "Users can update their own transaction" on transactions
  for update using (auth.uid() = "userId");
```
</details>


### 4. Configuring rpc functions
Likewise, you also need to create rpc function which basically calculates income and expense with provided filters.
<details>
<summary>SQL</summary>

```sql
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
```
</details>

### Running application locally

### 1. Clone the repository
```shell
git clone https://github.com/cynavi/buxx.git
cd buxx
```

### 2. Install npm dependencies

```shell
npm install
```

### 3. Update environment variable
Open `src/environments/environment.ts` and replace supbase url and key with your project details.
Config can be viewed under `API Settings`.
```typescript
export const environment = {
  supabase: {
    url: 'api-url',
    key: 'api-key'
  }
};
```

### 4. Run the dev server
```shell
npx nx serve
```

### 5. Open the app in your browser

Visit [http://localhost:4200](http://localhost:4200) in your browser. 

Happy coding :)
