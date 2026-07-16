"""
Generador de dataset sintético para TrendGear Dashboard.
Basado en la muestra validada (muestra_trendgear.psv), reproduce
la misma estructura de 11 columnas con distribuciones realistas.
"""
import csv
import random
from datetime import date, timedelta

random.seed(42)

NAMES = [
    "Laura", "Carlos", "Ana", "Diego", "Sofía", "Andrés", "Valentina", "Miguel",
    "Camila", "Santiago", "Isabella", "Juan", "Daniela", "Felipe", "Mariana",
    "Julián", "Paula", "Sebastián", "Natalia", "Alejandro", "Gabriela", "Tomás",
    "Manuela", "David", "Luciana", "Nicolás", "Valeria", "Esteban", "Sara", "Ricardo",
]
LASTNAMES = [
    "Gómez", "Pérez", "Torres", "Ramírez", "Martínez", "Rojas", "López", "Herrera",
    "Ríos", "Vargas", "Castro", "Morales", "Ortiz", "Guzmán", "Silva", "Cárdenas",
    "Mendoza", "Suárez", "Restrepo", "Beltrán",
]
PRODUCTS = [
    "Wireless Mouse", "Mechanical Keyboard", "4K Monitor", "USB-C Hub",
    "Noise Cancelling Headphones", "Gaming Chair", "Smartwatch", "Laptop Stand",
    "Wireless Charger", "External SSD 1TB", "Webcam HD", "Bluetooth Speaker",
    "Graphics Tablet", "Router Wi-Fi 6", "Portable Monitor", "Gaming Mousepad",
    "Mechanical Numpad", "Ring Light", "Laptop Backpack", "Docking Station",
]
CITIES = ["Bogotá", "Medellín", "Cali", "Cúcuta", "Barranquilla", "Bucaramanga", "Pereira"]
PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal"]
MEMBERSHIP = ["Bronze", "Silver", "Gold"]

# precios base por producto para que el amount_spent sea coherente
PRICE_RANGE = {
    "Wireless Mouse": (15, 40), "Mechanical Keyboard": (50, 120), "4K Monitor": (180, 320),
    "USB-C Hub": (15, 35), "Noise Cancelling Headphones": (90, 220), "Gaming Chair": (200, 400),
    "Smartwatch": (100, 300), "Laptop Stand": (20, 50), "Wireless Charger": (15, 35),
    "External SSD 1TB": (80, 160), "Webcam HD": (30, 80), "Bluetooth Speaker": (40, 100),
    "Graphics Tablet": (100, 250), "Router Wi-Fi 6": (60, 140), "Portable Monitor": (120, 260),
    "Gaming Mousepad": (10, 25), "Mechanical Numpad": (25, 55), "Ring Light": (20, 60),
    "Laptop Backpack": (30, 90), "Docking Station": (60, 150),
}

START_DATE = date(2025, 1, 1)
END_DATE = date(2025, 6, 30)


def random_date(start, end):
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def generate_row(customer_id):
    name = f"{random.choice(NAMES)} {random.choice(LASTNAMES)}"
    email_user = name.lower().replace(" ", ".").replace("é", "e").replace("í", "i") \
        .replace("á", "a").replace("ó", "o").replace("ú", "u").replace("ñ", "n")
    email = f"{email_user}{customer_id}@mailinator.com"

    product = random.choice(PRODUCTS)
    low, high = PRICE_RANGE[product]
    amount = round(random.uniform(low, high), 2)

    purchase_date = random_date(START_DATE, END_DATE)
    # last_login siempre es igual o posterior a la compra, hasta 30 días después
    last_login = purchase_date + timedelta(days=random.randint(0, 30))
    if last_login > END_DATE:
        last_login = END_DATE

    age = int(random.gauss(33, 9))
    age = max(13, min(100, age))

    return {
        "customer_id": customer_id,
        "name": name,
        "email": email,
        "product_purchased": product,
        "purchase_date": purchase_date.isoformat(),
        "amount_spent": f"{amount:.2f}",
        "age": age,
        "city": random.choice(CITIES),
        "payment_method": random.choice(PAYMENT_METHODS),
        "last_login_date": last_login.isoformat(),
        "membership_status": random.choice(MEMBERSHIP),
    }


def main(n=100, out_path="dataset_trendgear.csv"):
    fieldnames = [
        "customer_id", "name", "email", "product_purchased", "purchase_date",
        "amount_spent", "age", "city", "payment_method", "last_login_date",
        "membership_status",
    ]
    rows = [generate_row(1000 + i) for i in range(1, n + 1)]

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Dataset generado: {out_path} ({n} registros)")


if __name__ == "__main__":
    main(n=100)
