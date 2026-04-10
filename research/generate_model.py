# generate_model.py
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

np.random.seed(42)
N = 1000

weather_score  = np.random.uniform(0.0, 1.0, N)
traffic_score  = np.random.uniform(0.0, 1.0, N)
history_score  = np.random.uniform(0.0, 1.0, N)

X = np.column_stack([weather_score, traffic_score, history_score])

combined = 0.4 * weather_score + 0.35 * traffic_score + 0.25 * history_score
noise    = np.random.normal(0, 0.08, N)
y        = (combined + noise > 0.5).astype(int)

print(f"Dataset: {N} rows | Failures: {y.sum()} ({y.mean()*100:.1f}%) | Safe: {(1-y).sum()}")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=42
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False
)

y_pred = model.predict(X_test)
print("\nModel Performance on Test Set:")
print(classification_report(y_test, y_pred, target_names=["Safe", "Failure"]))

model.save_model("risk_model.json")
print("Model saved to risk_model.json")